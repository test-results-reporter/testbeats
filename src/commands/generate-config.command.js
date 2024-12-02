const prompts = require('prompts');
const fs = require('fs/promises');
const logger = require('../utils/logger');
const pkg = require('../../package.json');


class GenerateConfigCommand {
    /**
     * TODO: [BETA / Experimental Mode]
     * Generates initial TestBests configuration file
     */
    constructor(opts) {
        this.opts = opts;
        this.configPath = '.testbeats.json';
        this.config = {};
    }

    async execute() {
        logger.setLevel(this.opts.logLevel);
        this.#printBanner();
        logger.info(`🚧 Config generation is still in BETA mode, please report any issues at ${pkg.bugs.url}\n`);

        await this.#buildConfigFilePath();
        await this.#buildTestResultsConfig();
        await this.#buildTargetsConfig();
        await this.#buildGobalExtensionConfig();
        await this.#buildTestBeatsPortalConfig();
        await this.#saveConfigFile();
    }

    #printBanner() {
        const banner = `
         _____             _    ___                  _         
        (_   _)           ( )_ (  _'\\               ( )_       
          | |   __    ___ | ,_)| (_) )   __     _ _ | ,_)  ___ 
          | | /'__'\\/',__)| |  |  _ <' /'__'\\ /'_' )| |  /',__)
          | |(  ___/\\__, \\| |_ | (_) )(  ___/( (_| || |_ \\__, \\
          (_)'\\____)(____/'\\__)(____/''\\____)'\\__,_)'\\__)(____/
        
                             v${pkg.version}  
                        Config Generation [BETA]
        `;
        console.log(banner);
    }

    async #buildConfigFilePath() {
        const { configPath } = await prompts({
            type: 'text',
            name: 'configPath',
            message: 'Enter path for configuration file :',
            initial: '.testbeats.json'
        });
        this.configPath = configPath;
    }

    async #buildTestResultsConfig() {
        const runnerChoices = [
            { title: 'Mocha', value: 'mocha', selected: true },
            { title: 'JUnit', value: 'junit' },
            { title: 'TestNG', value: 'testng' },
            { title: 'Cucumber', value: 'cucumber' },
            { title: 'NUnit', value: 'nunit' },
            { title: 'xUnit', value: 'xunit' },
            { title: 'MSTest', value: 'mstest' }
        ]
        // Get test results details
        const { includeResults } = await prompts({
            type: 'toggle',
            name: 'includeResults',
            message: 'Do you want to configure test results?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        });

        if (!includeResults) { return };

        const { testResults } = await prompts({
            type: 'multiselect',
            name: 'testResults',
            message: 'Select test result types to include:',
            choices: runnerChoices,
            min: 1
        });

        // Handle result paths
        this.config.results = []
        for (const resultType of testResults) {
            const { path } = await prompts({
                type: 'text',
                name: 'path',
                message: `Enter file path for ${resultType} results (.json, .xml etc):`,
                initial: ""
            });
            this.config.results.push({
                files: path,
                type: resultType
            });
        }
    }

    async #buildTargetsConfig() {
        const targetChoices = [
            { title: 'Slack', value: 'slack' },
            { title: 'Microsoft Teams', value: 'teams' },
            { title: 'Google Chat', value: 'chat' }
        ];

        const { includeTargets } = await prompts({
            type: 'toggle',
            name: 'includeTargets',
            message: 'Do you want to configure notification targets (slack, teams, chat etc)?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        });

        if (!includeTargets) { return }

        this.config.targets = []
        const { targets } = await prompts({
            type: 'multiselect',
            name: 'targets',
            message: 'Select notification targets:',
            choices: targetChoices,
            min: 1
        });

        const { titleInput } = await prompts({
            type: 'text',
            name: 'titleInput',
            message: 'Enter notification title (optional):',
            initial: 'TestBeats Report'
        });

        // For each target, ask about target-specific extensions
        for (const target of targets) {
            const { webhookEnvVar } = await prompts({
                type: 'text',
                name: 'webhookEnvVar',
                message: `Enter environment variable name for ${target} webhook URL:`,
                initial: `${target.toUpperCase()}_WEBHOOK_URL`
            });

            const { useExtensions } = await prompts({
                type: 'toggle',
                name: 'useExtensions',
                message: `Do you want to configure extensions for ${target}?`,
                initial: true,
                active: 'Yes',
                inactive: 'No'
            });

            const targetConfig = {
                name: target,
                inputs: {
                    title: titleInput,
                    url: `{${webhookEnvVar}}`,
                    publish: 'test-summary'
                }
            };

            if (useExtensions) {
                targetConfig.extensions = [];
                const { selectedExtensions } = await prompts({
                    type: 'multiselect',
                    name: 'selectedExtensions',
                    message: `Select extensions for ${target}:`,
                    choices: this.#getExtensionsList(),
                    min: 1
                });

                // Configure extension-specific inputs
                for (const ext of selectedExtensions) {
                    const extConfig = await this.#buildExtensionConfig(ext, target);
                    targetConfig.extensions.push(extConfig);
                }
            }
            this.config.targets.push(targetConfig);
        }
    }

    async #buildGobalExtensionConfig() {
        const { includeGlobalExtensions } = await prompts({
            type: 'toggle',
            name: 'includeGlobalExtensions',
            message: 'Do you want to configure global extensions?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        });

        if (!includeGlobalExtensions) { return };

        this.config.extensions = [];
        const { globalExtensionsSelected } = await prompts({
            type: 'multiselect',
            name: 'globalExtensionsSelected',
            message: 'Select global extensions to enable:',
            choices: this.#getExtensionsList()
        });

        // Configure extension-specific inputs
        for (const ext of globalExtensionsSelected) {
            const extDetails = await this.#buildExtensionConfig(ext, null);
            this.config.extensions.push(extDetails);
        }
    }

    async #buildExtHyperlinks() {
        const links = [];
        const { addLink } = await prompts({
            type: 'toggle',
            name: 'addLink',
            message: 'Do you want to add a hyperlink?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        });

        while (addLink) {
            const { text, url } = await prompts([
                {
                    type: 'text',
                    name: 'text',
                    message: 'Enter link text:'
                },
                {
                    type: 'text',
                    name: 'url',
                    message: 'Enter link URL:'
                }
            ]);

            links.push({ text, url });

            const { addAnother } = await prompts({
                type: 'toggle',
                name: 'addAnother',
                message: 'Add another link?',
                initial: false,
                active: 'Yes',
                inactive: 'No'
            });
            if (!addAnother) break;
        }
        return { links };
    }

    async #buildExtMentions(targetName) {
        const users = [];
        const { addUser } = await prompts({
            type: 'toggle',
            name: 'addUser',
            message: 'Do you want to add user mentions?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        });

        while (addUser) {
            const user = {};
            const { name } = await prompts({
                type: 'text',
                name: 'name',
                message: 'Enter user name:'
            });
            user.name = name;

            if (targetName === 'teams') {
                const { teams_upn } = await prompts({
                    type: 'text',
                    name: 'teams_upn',
                    message: 'Enter Teams UPN (user principal name):'
                });
                user.teams_upn = teams_upn;
            } else if (targetName === 'slack') {
                const { slack_uid } = await prompts({
                    type: 'text',
                    name: 'slack_uid',
                    message: 'Enter Slack user ID:'
                });
                user.slack_uid = slack_uid;
            } else if (targetName === 'chat') {
                const { chat_uid } = await prompts({
                    type: 'text',
                    name: 'chat_uid',
                    message: 'Enter Google Chat user ID:'
                });
                user.chat_uid = chat_uid;
            }

            users.push(user);

            const { addAnother } = await prompts({
                type: 'toggle',
                name: 'addAnother',
                message: 'Add another user?',
                initial: false,
                active: 'Yes',
                inactive: 'No'
            });
            if (!addAnother) break;
        }
        return { users };
    }

    async #buildExtMetadata() {
        const data = [];
        const { addMetadata } = await prompts({
            type: 'toggle',
            name: 'addMetadata',
            message: 'Do you want to add metadata?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        });

        while (addMetadata) {
            const { key, value } = await prompts([
                {
                    type: 'text',
                    name: 'key',
                    message: 'Enter metadata key:'
                },
                {
                    type: 'text',
                    name: 'value',
                    message: 'Enter metadata value:'
                }
            ]);

            data.push({ key, value });

            const { addAnother } = await prompts({
                type: 'toggle',
                name: 'addAnother',
                message: 'Add another metadata item?',
                initial: false,
                active: 'Yes',
                inactive: 'No'
            });
            if (!addAnother) break;
        }
        return { data };
    }

    async #buildExtensionConfig(extension, target) {
        const extConfig = {
            name: extension
        };

        switch (extension) {
            case 'hyperlinks':
                extConfig.inputs = await this.#buildExtHyperlinks()
                break;

            case 'mentions':
                extConfig.inputs = await this.#buildExtMentions(target);
                break;

            case 'metadata':
                extConfig.inputs = await this.#buildExtMetadata();
                break;

            default:
                // Add default configuration for other extensions
                extConfig.inputs = {
                    title: '',
                    separator: target === 'slack' ? false : true
                };
        }
        return extConfig;
    }

    async #buildTestBeatsPortalConfig() {
        // TestBeats configuration
        const { includeTestBeats } = await prompts({
            type: 'toggle',
            name: 'includeTestBeats',
            message: 'Do you want to configure TestBeats API key (optional)?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        });

        if (includeTestBeats) {
            const { apiKey } = await prompts({
                type: 'text',
                name: 'apiKey',
                message: 'Enter environment variable name for API key (optional):',
                initial: '{TEST_RESULTS_API_KEY}'
            });

            const { project } = await prompts({
                type: 'text',
                name: 'project',
                message: 'Enter project name (optional):'
            });

            this.config.api_key = apiKey;
            // Add optional fields only if they have values
            if (project?.trim()) {
                this.config.project = project.trim();
            }
        }
    }

    #sortConfig() {
        // Sort keys alphabetically
        this.config = Object.keys(this.config).sort()
            .reduce((sortedConfig, key) => {
                sortedConfig[key] = this.config[key];
                return sortedConfig;
            }, {});
    }

    async #saveConfigFile() {
        // Write config to file
        try {
            await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
            logger.info(`✅ Configuration file successfully generated: ${this.configPath}`);
        } catch (error) {
            throw new Error(`Error: ${error.message}`)
        }
    }

    #getExtensionsList() {
        // List of Extensions supported
        return [
            { title: 'Quick Chart Test Summary', value: 'quick-chart-test-summary' },
            { title: 'CI Information', value: 'ci-info' },
            { title: 'Hyperlinks', value: 'hyperlinks' },
            { title: 'Mentions', value: 'mentions' },
            { title: 'Report Portal Analysis', value: 'report-portal-analysis' },
            { title: 'Report Portal History', value: 'report-portal-history' },
            { title: 'Percy Analysis', value: 'percy-analysis' },
            { title: 'Metadata', value: 'metadata' },
            { title: 'AI Failure Summary', value: 'ai-failure-summary' },
            { title: 'Smart Analysis', value: 'smart-analysis' },
            { title: 'Error Clusters', value: 'error-clusters' }
        ];
    }
}

module.exports = { GenerateConfigCommand }; 