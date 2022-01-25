#!/usr/bin/env node
require('dotenv').config();

const sade = require('sade');
 
const prog = sade('test-results-reporter');
const publish = require('./commands/publish');
 
prog
  .version('0.0.7')
  .option('-c, --config', 'Provide path to custom config', 'config.json');

prog.command('publish')
  .action(async (opts) => {
    try {
      await publish.run(opts);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

prog.parse(process.argv);