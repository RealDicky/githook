
import axios from 'axios';
import config from './config.js';

export async function generateCommitMessage(diff) {
    const apiKey = config.get('apiKey');
    let endpoint = config.get('apiEndpoint');
    if (!endpoint.endsWith('/chat/completions') && !endpoint.includes('/v1/')) {
        // Simple heuristic: if it looks like a base URL, append standard path
        endpoint = endpoint.replace(/\/+$/, '') + '/chat/completions';
    }
    const model = config.get('model');
    const language = config.get('language');

    if (!apiKey) {
        throw new Error('API Key is missing. Please set it using: gma config apiKey <your-key>');
    }

    const prompt = `
You are a commit message generator.
Based on the following git diff, generate a concise and descriptive commit message.
The message should follow the Conventional Commits format (e.g., feat: ..., fix: ...).
Use ${language} for the commit message.
Only output the commit message, no other text.

Git Diff:
${diff.substring(0, 4000)} // Truncate to avoid token limits if necessary
`;

    try {
        const response = await axios.post(endpoint, {
            model: model,
            messages: [
                { role: 'user', content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });


        const content = response.data?.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error('Invalid response from AI provider');
        }
        return content.trim();

    } catch (error) {
        if (error.response) {
            throw new Error(`AI API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
}

export async function generateBranchName(description) {
    const apiKey = config.get('apiKey');
    let endpoint = config.get('apiEndpoint');
    if (!endpoint.endsWith('/chat/completions') && !endpoint.includes('/v1/')) {
        endpoint = endpoint.replace(/\/+$/, '') + '/chat/completions';
    }
    const model = config.get('model');

    if (!apiKey) {
        throw new Error('API Key is missing. Please set it using: gma config apiKey <your-key>');
    }

    const prompt = `
You are a git branch name generator.
Based on the following description, generate a short, concise branch name suffix (kebab-case).
Do NOT include "feature/" or "hotfix/" prefix.
Only output the branch name suffix.

Description: ${description}
`;

    try {
        const response = await axios.post(endpoint, {
            model: model,
            messages: [
                { role: 'user', content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data?.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error('Invalid response from AI provider');
        }
        // Remove any surrounding quotes or whitespace
        return content.trim().replace(/^['"]|['"]$/g, '');

    } catch (error) {
         if (error.response) {
            throw new Error(`AI API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
}
