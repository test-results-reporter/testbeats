#!/usr/bin/env node
require('dotenv').config();

const sade = require('sade');

const prog = sade('testbeats');
const { PublishCommand } = require('./commands/publish.command');
const logger = require('./utils/logger');
const pkg = require('../package.json');

prog
  .version(pkg.version)
  .option('-c, --config', 'path to config file')
  .option('-l, --logLevel', 'Log Level', "INFO")
  .option('--api-key', 'api key')
  .option('--project', 'project name')
  .option('--run', 'run name')
  .option('--slack', 'slack webhook url')
  .option('--teams', 'teams webhook url')
  .option('--chat', 'chat webhook url')
  .option('--title', 'title of the test run')
  .option('--junit', 'junit xml path')
  .option('--testng', 'testng xml path')
  .option('--cucumber', 'cucumber json path')
  .option('--mocha', 'mocha json path')
  .option('--nunit', 'nunit xml path')
  .option('--xunit', 'xunit xml path')
  .option('--mstest', 'mstest xml path')
  .option('-ci-info', 'ci info extension')
  .option('-chart-test-summary', 'chart test summary extension');

prog.command('publish')
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

prog.parse(process.argv);
