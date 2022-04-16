const path = require('path');
const { parse } = require('test-results-parser');
const { processData } = require('../helpers/helper');
const target_manager = require('../targets');

async function run(opts) {
  if (typeof opts.config === 'string') {
    const cwd = process.cwd();
    opts.config = require(path.join(cwd, opts.config));
  }
  const config = processData(opts.config);
  for (const report of config.reports) {
    const results = [];
    for (const result of report.results) {
      results.push(parse(result));
    }
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      for (const target of report.targets) {
        await target_manager.run(target, result);
      }
    }
  }
}

module.exports = {
  run
}