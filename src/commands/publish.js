const path = require('path');
const { parse } = require('test-results-parser');
const { processData } = require('../helpers/helper');
const targets = require('../targets');

async function run(opts) {
  const cwd = process.cwd();
  const config = processData(require(path.join(cwd, opts.config)));
  const testResults = [];
  for (const report of config.reports) {
    for (const result of report.results) {
      testResults.push(parse(result));
    }
    for (const target of report.targets) {
      await targets.send(target, testResults, report.options);
    }
  }
}

module.exports = {
  run
}