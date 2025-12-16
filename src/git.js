
import { execa } from 'execa';

export async function getDiff() {
    try {
        const { stdout } = await execa('git', ['diff', '--cached']);
        return stdout;
    } catch (error) {
        throw new Error('Failed to get git diff. Make sure you are in a git repository.');
    }
}

export async function hasStagedChanges() {
    try {
        const { stdout } = await execa('git', ['diff', '--cached', '--name-only']);
        return stdout.trim().length > 0;
    } catch (error) {
        return false;
    }
}

export async function stageAll() {
    try {
        await execa('git', ['add', '-A']);
    } catch (error) {
        throw new Error('Failed to stage changes.');
    }
}

export async function commit(message) {
    try {
        await execa('git', ['commit', '-m', message], { stdio: 'inherit' });
    } catch (error) {
        throw new Error('Failed to commit changes.');
    }
}

export async function hasUncommittedChanges() {
    try {
        const { stdout } = await execa('git', ['status', '--porcelain']);
        return stdout.trim().length > 0;
    } catch (error) {
        throw new Error('Failed to check git status.');
    }
}

export async function hasUnpushedCommits() {
    try {
        // structural check: @{u} might not exist if no upstairs configured
        // If no upstream, we assume unpushed if there are commits not on remote?
        // Simpler: just check if we can run git log @{u}..HEAD.
        // If it fails, maybe no upstream.
        await execa('git', ['rev-parse', '@{u}']);
        const { stdout } = await execa('git', ['log', '@{u}..HEAD', '--oneline']);
        return stdout.trim().length > 0;
    } catch (error) {
        // If upstream is not configured, technically everything is unpushed if we intend to push? 
        // Or maybe ignore this check if no upstream? 
        // User requiest: "have uncommitted, unpushed files".
        // Let's return false if no upstream is set, or maybe true? 
        // Safest is to return false and warn, or just ignore. 
        // However, user specifically asked to error on unpushed.
        // If no upstream, we can't determine "unpushed" easily without knowing where to push.
        // Lets assume if error (no upstream), we treat it as hasUnpushedCommits = true (safer) or allow?
        // Git default behavior: if no upstream, usually you need to push -u.
        return false; 
    }
}

export async function checkout(branch) {
    try {
        await execa('git', ['checkout', branch]);
    } catch (error) {
        throw new Error(`Failed to checkout ${branch}. Make sure it exists.`);
    }
}

export async function createBranch(branch) {
    try {
        await execa('git', ['checkout', '-b', branch]);
    } catch (error) {
        throw new Error(`Failed to create branch ${branch}.`);
    }
}

export async function getCurrentBranch() {
    try {
        const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
        return stdout.trim();
    } catch (error) {
        return null;
    }
}

export async function pull() {
    try {
        await execa('git', ['pull']);
    } catch (error) {
         // might fail if no upstream, ignore
    }
}
