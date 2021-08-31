const path = require('path');
const { parse } = require('../parser');
const { getPayload } = require('../messages');
const teams = require('../clients/teams');

async function run(opts) {
  const cwd = process.cwd();
  const config = require(path.join(cwd, opts.config));
  const testResults = [];
  for (const report of config.reports) {
    for (const result of report.results) {
      testResults.push(parse(result));
    }
    for (const target of report.targets) {
      const message = getPayload(testResults, report.options);
      await teams.send(message, target);
    }
  }
}

module.exports = {
  run
}