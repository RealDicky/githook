
import Conf from 'conf';

const schema = {
	apiKey: {
		type: 'string',
        default: ''
	},
	apiEndpoint: {
		type: 'string',
		default: 'https://api.deepseek.com/chat/completions'
	},
	model: {
		type: 'string',
		default: 'deepseek-chat'
	},
    autoCommit: {
        type: 'boolean',
        default: false
    },
	language: {
        type: 'string',
        default: 'zh-CN'
    },
    prefix: {
        type: 'string',
        default: ''
    },
    baseBranch: {
        type: 'string',
        default: 'master'
    }
};

const config = new Conf({
    projectName: 'gma-cli',
    schema
});

export default config;
