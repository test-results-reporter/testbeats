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
    const globalOpts = report.options || {};
    for (const target of report.targets) {
      const clonedGlobalOpts = Object.assign({}, globalOpts);
      const options = Object.assign(target, clonedGlobalOpts);
      await targets.send(options, testResults);
    }
  }
}

module.exports = {
  run
}