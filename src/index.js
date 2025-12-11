
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCommitMessage } from './ai.js';
import config from './config.js';
import { commit, getDiff, hasStagedChanges, stageAll } from './git.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Read package.json to get version
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
    .name('gma')
    .description('AI-powered git commit message generator')
    .version(pkg.version);

program
    .command('config <key> [value]')
    .description('Get or set configuration')
    .action((key, value) => {
        if (value) {
            let val = value;
            if (value === 'true') val = true;
            if (value === 'false') val = false;
            config.set(key, val);
            console.log(chalk.green(`Configuration updated: ${key} = ${val}`));
        } else {
            console.log(`${key} = ${config.get(key)}`);
        }
    });

program
    .command('generate', { isDefault: true })
    .description('Generate commit message and commit')
    .option('-y, --yes', 'Skip confirmation')
    .action(async (options) => {
        try {
            const spinner = ora('Checking git status...').start();
            
            await stageAll();
            
            if (!await hasStagedChanges()) {
                spinner.fail('No changes to commit.');
                return;
            }

            const diff = await getDiff();
            if (!diff) {
                spinner.fail('No diff found (staged).');
                return;
            }

            spinner.text = 'Generating commit message...';
            const message = await generateCommitMessage(diff);
            spinner.stop();

            console.log(chalk.bold('\nGenerated Commit Message:'));
            console.log(chalk.blue(message) + '\n');

            if (options.yes || config.get('autoCommit')) {
                await commit(message);
                console.log(chalk.green('✔ Committed successfully!'));
            } else {
                const { action } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: 'What would you like to do?',
                        choices: [
                            { name: 'Commit', value: 'commit' },
                            { name: 'Edit', value: 'edit' },
                            { name: 'Cancel', value: 'cancel' }
                        ]
                    }
                ]);

                if (action === 'commit') {
                    await commit(message);
                    console.log(chalk.green('✔ Committed successfully!'));
                } else if (action === 'edit') {
                    const { newMessage } = await inquirer.prompt([
                        {
                            type: 'editor',
                            name: 'newMessage',
                            message: 'Edit commit message:',
                            default: message
                        }
                    ]);
                    await commit(newMessage.trim());
                    console.log(chalk.green('✔ Committed successfully!'));
                } else {
                    console.log(chalk.yellow('Commit cancelled.'));
                }
            }

        } catch (error) {
           // spinner.stop();
            console.error(chalk.red(`\nError: ${error.message}`));
            process.exit(1);
        }
    });

export async function run() {
    await program.parseAsync(process.argv);
}
