
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBranchName } from './ai.js';
import config from './config.js';
import { checkout, createBranch, hasUncommittedChanges, hasUnpushedCommits, pull } from './git.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
    .name('gmm')
    .description('Git Master Merge / Branch Manager')
    .version(pkg.version);

program
    .command('config')
    .description('Configure gmm')
    .command('setPrefix <prefix>')
    .description('Set the branch prefix')
    .action((prefix) => {
        config.set('prefix', prefix);
        console.log(chalk.green(`Configuration updated: prefix = ${prefix}`));
    });

program
    .description('Create a new branch')
    .option('-f, --fix', 'Create a hotfix branch')
    .option('-m, --message <message>', 'Description to generate branch name from')
    .action(async (options) => {
        try {
            const spinner = ora('Checking git status...').start();

            // 1. Check for uncommitted/unpushed changes
            if (await hasUncommittedChanges()) {
                spinner.fail(chalk.red('Error: You have uncommitted changes. Please commit or stash them first.'));
                process.exit(1);
            }

            // Note: hasUnpushedCommits might need upstream access. 
            // If it fails (no upstream), we might warn but proceed, or strictly fail.
            // Based on user request "未push的文件，有则报错退出", we should try to fail.
            if (await hasUnpushedCommits()) {
                 spinner.fail(chalk.red('Error: You have unpushed commits. Please push them first.'));
                 process.exit(1);
            }
            
            spinner.succeed('Git status clean.');

            // 2. Switch to base branch
            const baseBranch = config.get('baseBranch') || 'master';
            spinner.start(`Switching to base branch: ${baseBranch}...`);
            
            try {
                await checkout(baseBranch);
                await pull(); // Always pull latest
                spinner.succeed(`Switched to ${baseBranch} and pulled latest changes.`);
            } catch(e) {
                 spinner.fail(chalk.red(`Failed to switch to ${baseBranch}. Make sure it exists.`));
                 process.exit(1);
            }

            // 3. Generate branch name
            const prefix = config.get('prefix');
            const type = options.fix ? 'hotfix' : 'feature';
            
            let suffix = '';
            let prefixPart = prefix ? `${prefix}-` : '';

            if (options.message) {
                spinner.start('Generating branch name from description...');
                try {
                    const generatedSuffix = await generateBranchName(options.message);
                    suffix = generatedSuffix;
                    spinner.succeed('Branch name generated.');
                } catch (e) {
                    spinner.fail(chalk.red(`Failed to generate branch name: ${e.message}`));
                    process.exit(1);
                }
            } else {
                // Time based: MMDD
                const now = new Date();
                const month = (now.getMonth() + 1).toString().padStart(2, '0');
                const day = now.getDate().toString().padStart(2, '0');
                suffix = `${month}${day}`;
            }

            const branchName = `${type}/${prefixPart}${suffix}`;

            // 4. Create branch
            spinner.start(`Creating branch: ${branchName}...`);
            try {
                await createBranch(branchName);
                spinner.succeed(chalk.green(`✔ Branch created and switched to: ${branchName}`));
            } catch (e) {
                spinner.fail(chalk.red(`Failed to create branch ${branchName}: ${e.message}`));
                process.exit(1);
            }

        } catch (error) {
            console.error(chalk.red(`\nError: ${error.message}`));
            process.exit(1);
        }
    });

export async function run() {
    await program.parseAsync(process.argv);
}
