
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
