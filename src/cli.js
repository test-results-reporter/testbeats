#!/usr/bin/env node
require('dotenv').config();

const sade = require('sade');

const prog = sade('testbeats');
const { PublishCommand } = require('./commands/publish.command');
const logger = require('./utils/logger');

prog
  .version('2.0.2')
  .option('-c, --config', 'Provide path to custom config', 'config.json')
  .option('-l, --logLevel', 'Log Level', "INFO");

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