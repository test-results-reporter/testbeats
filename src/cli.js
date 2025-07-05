#!/usr/bin/env node
require('dotenv').config();

const sade = require('sade');

const prog = sade('testbeats');
const { PublishCommand } = require('./commands/publish.command');
const { GenerateConfigCommand } = require('./commands/generate-config.command');
const logger = require('./utils/logger');
const pkg = require('../package.json');

prog
  .version(pkg.version)
  .option('-l, --logLevel', 'Log Level', "INFO")


// Command to publish test results
prog.command('publish')
  .option('-c, --config', 'path to config file')
  .option('--api-key', 'api key')
  .option('--project', 'project name')
  .option('--run', 'run name')
  .option('--slack', 'slack webhook url')
  .option('--teams', 'teams webhook url')
  .option('--chat', 'chat webhook url')
  .option('--github', 'github token')
  .option('--title', 'title of the test run')
  .option('--junit', 'junit xml path')
  .option('--testng', 'testng xml path')
  .option('--cucumber', 'cucumber json path')
  .option('--mocha', 'mocha json path')
  .option('--nunit', 'nunit xml path')
  .option('--xunit', 'xunit xml path')
  .option('--mstest', 'mstest xml path')
  .option('-ci-info', 'ci info extension')
  .option('-chart-test-summary', 'chart test summary extension')
  .action(async (opts) => {
    try {
      logger.setLevel(opts.logLevel);
      const publish_command = new PublishCommand(opts);
      await publish_command.publish();
    } catch (error) {
      logger.error(`Report publish failed: ${error.message}`);
      process.exit(1);
    }
  });

// Command to initialize and generate TestBeats Configuration file
prog.command('init')
  .describe('Generate a TestBeats configuration file')
  .example('init')
  .action(async (opts) => {
    try {
      const generate_command = new GenerateConfigCommand(opts);
      await generate_command.execute();
    } catch (error) {
      if (error.name === 'ExitPromptError') {
        logger.info('😿 Configuration generation was canceled by the user.');
      } else {
        throw new Error(`❌ Error in generating configuration file: ${error.message}`)
      }
      process.exit(1);
    }
  });

prog.parse(process.argv);
