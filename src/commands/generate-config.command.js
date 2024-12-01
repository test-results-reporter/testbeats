const { input, confirm, checkbox } = require('@inquirer/prompts');
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
            { name: 'Quick Chart Test Summary', value: 'quick-chart-test-summary' },
            { name: 'CI Information', value: 'ci-info' },
            { name: 'Hyperlinks', value: 'hyperlinks' },
            { name: 'Mentions', value: 'mentions' },
            { name: 'Report Portal Analysis', value: 'report-portal-analysis' },
            { name: 'Report Portal History', value: 'report-portal-history' },
            { name: 'Percy Analysis', value: 'percy-analysis' },
            { name: 'Metadata', value: 'metadata' },
            { name: 'AI Failure Summary', value: 'ai-failure-summary' },
            { name: 'Smart Analysis', value: 'smart-analysis' },
            { name: 'Error Clusters', value: 'error-clusters' }
        ];

        // Get initial answers
        const configPath = await input({
            message: 'Enter path for configuration file :',
            default: '.testbeats.json'
        });

        const includeResults = await confirm({
            message: 'Do you want to configure test results?',
            default: true
        });

        if (includeResults) {
            testResults = await checkbox({
                message: 'Select test result types to include:',
                choices: [
                    { name: 'Mocha', value: 'mocha' , checked: true},
                    { name: 'JUnit', value: 'junit' },
                    { name: 'TestNG', value: 'testng' },
                    { name: 'Cucumber', value: 'cucumber' },
                    { name: 'NUnit', value: 'nunit' },
                    { name: 'xUnit', value: 'xunit' },
                    { name: 'MSTest', value: 'mstest' }
                ],
                required: true
            });
        }

        const includeTargets = await confirm({
            message: 'Do you want to configure notification targets (slack, teams, chat etc)?',
            default: true
        });

        if (includeTargets) {
            targets = await checkbox({
                message: 'Select notification targets:',
                choices: [
                    { name: 'Slack', value: 'slack' },
                    { name: 'Microsoft Teams', value: 'teams' },
                    { name: 'Google Chat', value: 'chat' }
                ],
                required: true
            });

            if (targets.length > 0) {

                title = await input({
                    message: 'Enter notification title (optional):'
                });

                // For each target, ask about target-specific extensions
                for (const target of targets) {
                    webhookEnvVars[target] = await input({
                        message: `Enter environment variable name for ${target} webhook URL:`,
                        default: `${target.toUpperCase()}_WEBHOOK_URL`
                    });

                    const useExtensions = await confirm({
                        message: `Do you want to configure extensions for ${target}?`,
                        default: true
                    });

                    if (useExtensions) {
                        targetExtensions[`${target}Extensions`] = true;
                        targetExtensions[`${target}ExtensionsList`] = await checkbox({
                            message: `Select extensions for ${target}:`,
                            choices: extensionsList,
                            required: true
                        });

                        // Configure extension-specific inputs
                        for (const ext of targetExtensions[`${target}ExtensionsList`]) {
                            targetExtensions[`${target}${ext}Config`] = await this.#promptExtensionConfig(ext, target);
                        }
                    }
                }
            }
        }

        const includeGlobalExtensions = await confirm({
            message: 'Do you want to configure global extensions?',
            default: false
        });

        if (includeGlobalExtensions) {
            const globalExtensionsSelected = await checkbox({
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
                resultPaths[`${resultType}Path`] = await input({
                    message: `Enter file path for ${resultType} results (.json, .xml etc):`,
                    default: "",
                });
            }
        }

        // TestBeats configuration
        const includeTestBeats = await confirm({
            message: 'Do you want to configure TestBeats API key (optional)?',
            default: false
        });

        if (includeTestBeats) {
            const apiKey = await input({
                message: 'Enter environment variable name for API key (optional):',
                default: '{TEST_RESULTS_API_KEY}'
            });

            const project = await input({
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
                const addLink = await confirm({
                    message: 'Do you want to add a hyperlink?',
                    default: true
                });
                
                while (addLink) {
                    links.push({
                        text: await input({ message: 'Enter link text:' }),
                        url: await input({ message: 'Enter link URL:' }),
                        condition: await input({
                            message: 'Enter condition (PASS, FAIL, or PASS_OR_FAIL):',
                            default: 'PASS_OR_FAIL'
                        })
                    });

                    const addAnother = await confirm({
                        message: 'Add another link?',
                        default: false
                    });
                    if (!addAnother) break;
                }
                config.inputs = { links };
                break;

            case 'mentions':
                const users = [];
                const addUser = await confirm({
                    message: 'Do you want to add user mentions?',
                    default: true
                });

                while (addUser) {
                    const user = {};
                    user.name = await input({ message: 'Enter user name:' });
                    
                    if (target === 'teams') {
                        user.teams_upn = await input({ message: 'Enter Teams UPN (user principal name):' });
                    } else if (target === 'slack') {
                        user.slack_uid = await input({ message: 'Enter Slack user ID:' });
                    } else if (target === 'chat') {
                        user.chat_uid = await input({ message: 'Enter Google Chat user ID:' });
                    }

                    users.push(user);

                    const addAnother = await confirm({
                        message: 'Add another user?',
                        default: false
                    });
                    if (!addAnother) break;
                }
                config.inputs = { users };
                break;

            case 'metadata':
                const data = [];
                const addMetadata = await confirm({
                    message: 'Do you want to add metadata?',
                    default: true
                });

                while (addMetadata) {
                    data.push({
                        key: await input({ message: 'Enter metadata key:' }),
                        value: await input({ message: 'Enter metadata value:' }),
                        condition: await input({
                            message: 'Enter condition (PASS, FAIL, or PASS_OR_FAIL):',
                            default: 'PASS_OR_FAIL'
                        })
                    });

                    const addAnother = await confirm({
                        message: 'Add another metadata item?',
                        default: false
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