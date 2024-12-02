const prompts = require('prompts');
const fs = require('fs/promises');
const logger = require('../utils/logger');


class GenerateConfigCommand {
    /**
     * TODO: [BETA / Experimental Mode]
     * Generates initial TestBests configuration file
     *  
     */
    constructor() {
        this.answers = [];
        this.config = []
    }

    async execute() {
        this.answers = await this.#promptQuestions();
        this.config = this.#generateConfigObject(this.answers);
        
        // Write config to file
        try {
            await fs.writeFile(this.answers.configPath, JSON.stringify(this.config, null, 2));
            logger.info(`✅ Configuration file successfully generated: ${this.answers.configPath}`);
        } catch (error) {
            throw new Error(`Error: ${error.message}`)
        }
    }
    
    async #promptQuestions() {
        // Prompt user input questions for the configuration
        let targets = [];
        let webhookEnvVars = [];
        let title = '';
        let testResults = [];
        const testBeatsConfig = {};
        const targetExtensions = {};
        const globalExtensions = [];
        const extensionsList = [
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

        // Get initial answers
        const { configPath, includeResults } = await prompts([{
            type: 'text',
            name: 'configPath',
            message: 'Enter path for configuration file :',
            initial: '.testbeats.json'
        },
        {
            type: 'toggle',
            name: 'includeResults',
            message: 'Do you want to configure test results?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        }]);

        if (includeResults) {
            const response = await prompts({
                type: 'multiselect',
                name: 'testResults',
                message: 'Select test result types to include:',
                choices: [
                    { title: 'Mocha', value: 'mocha', selected: true },
                    { title: 'JUnit', value: 'junit' },
                    { title: 'TestNG', value: 'testng' },
                    { title: 'Cucumber', value: 'cucumber' },
                    { title: 'NUnit', value: 'nunit' },
                    { title: 'xUnit', value: 'xunit' },
                    { title: 'MSTest', value: 'mstest' }
                ],
                min: 1
            });
            testResults = response.testResults;
        }

        const { includeTargets } = await prompts({
            type: 'toggle',
            name: 'includeTargets',
            message: 'Do you want to configure notification targets (slack, teams, chat etc)?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        });

        if (includeTargets) {
            const response = await prompts({
                type: 'multiselect',
                name: 'targets',
                message: 'Select notification targets:',
                choices: [
                    { title: 'Slack', value: 'slack' },
                    { title: 'Microsoft Teams', value: 'teams' },
                    { title: 'Google Chat', value: 'chat' }
                ],
                min: 1
            });
            targets = response.targets;

            if (targets.length > 0) {
                const { titleInput } = await prompts({
                    type: 'text',
                    name: 'titleInput',
                    message: 'Enter notification title (optional):'
                });
                title = titleInput;

                // For each target, ask about target-specific extensions
                for (const target of targets) {
                    const { webhookEnvVar } = await prompts({
                        type: 'text',
                        name: 'webhookEnvVar',
                        message: `Enter environment variable name for ${target} webhook URL:`,
                        initial: `${target.toUpperCase()}_WEBHOOK_URL`
                    });
                    webhookEnvVars[target] = webhookEnvVar;

                    const { useExtensions } = await prompts({
                        type: 'toggle',
                        name: 'useExtensions',
                        message: `Do you want to configure extensions for ${target}?`,
                        initial: true,
                        active: 'Yes',
                        inactive: 'No'
                    });

                    if (useExtensions) {
                        targetExtensions[`${target}Extensions`] = true;
                        const { selectedExtensions } = await prompts({
                            type: 'multiselect',
                            name: 'selectedExtensions',
                            message: `Select extensions for ${target}:`,
                            choices: extensionsList,
                            min: 1
                        });
                        targetExtensions[`${target}ExtensionsList`] = selectedExtensions;

                        // Configure extension-specific inputs
                        for (const ext of targetExtensions[`${target}ExtensionsList`]) {
                            targetExtensions[`${target}${ext}Config`] = await this.#promptExtensionConfig(ext, target);
                        }
                    }
                }
            }
        }

        const { includeGlobalExtensions } = await prompts({
            type: 'toggle',
            name: 'includeGlobalExtensions',
            message: 'Do you want to configure global extensions?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        });

        if (includeGlobalExtensions) {
            const { globalExtensionsSelected } = await prompts({
                type: 'multiselect',
                name: 'globalExtensionsSelected',
                message: 'Select global extensions to enable:',
                choices: extensionsList
            });

            // Configure extension-specific inputs
            for (const ext of globalExtensionsSelected) {
                const extDetails = await this.#promptExtensionConfig(ext, null);
                globalExtensions.push(extDetails);
            }
        }

        // Handle result paths
        const resultPaths = {};
        if (testResults.length > 0) {
            for (const resultType of testResults) {
                const { path } = await prompts({
                    type: 'text',
                    name: 'path',
                    message: `Enter file path for ${resultType} results (.json, .xml etc):`,
                    initial: ""
                });
                resultPaths[`${resultType}Path`] = path;
            }
        }

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

            testBeatsConfig.push({
                api_key: apiKey,
                project
            });
        }

        // Combine all answers
        return {
            configPath,
            ...testBeatsConfig,
            includeResults,
            testResults,
            includeTargets,
            targets,
            webhookEnvVars,
            title,
            includeGlobalExtensions,
            globalExtensions,
            ...targetExtensions,
            ...resultPaths
        };
    }
  
    async #promptExtensionConfig(extension, target) {
        const config = {
            name: extension
        };

        switch (extension) {
            case 'hyperlinks':
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
                    const { text, url, condition } = await prompts([
                        {
                            type: 'text',
                            name: 'text',
                            message: 'Enter link text:'
                        },
                        {
                            type: 'text',
                            name: 'url',
                            message: 'Enter link URL:'
                        },
                        {
                            type: 'text',
                            name: 'condition',
                            message: 'Enter condition (PASS, FAIL, or PASS_OR_FAIL):',
                            initial: 'PASS_OR_FAIL'
                        }
                    ]);

                    links.push({ text, url, condition });

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
                config.inputs = { links };
                break;

            case 'mentions':
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
                    
                    if (target === 'teams') {
                        const { teams_upn } = await prompts({
                            type: 'text',
                            name: 'teams_upn',
                            message: 'Enter Teams UPN (user principal name):'
                        });
                        user.teams_upn = teams_upn;
                    } else if (target === 'slack') {
                        const { slack_uid } = await prompts({
                            type: 'text',
                            name: 'slack_uid',
                            message: 'Enter Slack user ID:'
                        });
                        user.slack_uid = slack_uid;
                    } else if (target === 'chat') {
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
                config.inputs = { users };
                break;

            case 'metadata':
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
                    const { key, value, condition } = await prompts([
                        {
                            type: 'text',
                            name: 'key',
                            message: 'Enter metadata key:'
                        },
                        {
                            type: 'text',
                            name: 'value',
                            message: 'Enter metadata value:'
                        },
                        {
                            type: 'text',
                            name: 'condition',
                            message: 'Enter condition (PASS, FAIL, or PASS_OR_FAIL):',
                            initial: 'PASS_OR_FAIL'
                        }
                    ]);

                    data.push({ key, value, condition });

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
                config.inputs = { data };
                break;

            // Add default configuration for other extensions
            default:
                config.inputs = {
                    title: '',
                    separator: target === 'slack' ? false : true
                };
        }

        return config;
    }
  
    #generateConfigObject() {
      const config = {};
  
      // Add API key (required)
      config.api_key = this.answers.apiKey;
  
      // Add optional fields only if they have values
      if (this.answers.project?.trim()) {
        config.project = this.answers.project.trim();
      }
  
      // Add test results if included
      if (this.answers.includeResults && Array.isArray(this.answers.testResults) && this.answers.testResults.length > 0) {
        // Check if result paths exist before mapping
        const validResults = this.answers.testResults.filter(type => this.answers[`${type}Path`]);
        if (validResults.length > 0) {
            config.results = validResults.map(type => ({
                files: [this.answers[`${type}Path`]],
                type
            }));
        }
      }
  
      // Add global extensions if included
      if (this.answers.includeGlobalExtensions && this.answers.globalExtensions?.length > 0) {
        config.extensions = this.answers.globalExtensions.map(name => ({ name }));
      }
  
      // Add targets if included
      if (this.answers.includeTargets && this.answers.targets?.length > 0) {
        config.targets = this.answers.targets.map(target => {
          const targetConfig = {
            name: target,
            inputs: {
              url: `{${this.answers.webhookEnvVars[target]}}`,
              publish: 'test-summary'
            }
          };
  
          if (this.answers.title?.trim()) {
            targetConfig.inputs.title = this.answers.title.trim();
          }
  
          // Add target-specific extensions with their configurations
          if (this.answers[`${target}Extensions`] && this.answers[`${target}ExtensionsList`]?.length > 0) {
            targetConfig.extensions = this.answers[`${target}ExtensionsList`].map(ext => {
                return this.answers[`${target}${ext}Config`];
            });
          }
  
          return targetConfig;
        });
      }
  
      // Sort keys alphabetically
      return Object.keys(config).sort()
                .reduce((sortedConfig, key) => {
                    sortedConfig[key] = config[key];
                    return sortedConfig;
                }, {});
    }
  
}

module.exports = { GenerateConfigCommand }; 