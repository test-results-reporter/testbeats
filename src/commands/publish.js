const path = require('path');
const trp = require('test-results-parser');
const prp = require('performance-results-parser');

const { processData } = require('../helpers/helper');
const target_manager = require('../targets');

/**
 * @param {import('../index').PublishOptions} opts 
 */
async function run(opts) {
  if (typeof opts.config === 'string') {
    const cwd = process.cwd();
    opts.config = require(path.join(cwd, opts.config));
  }
  const config = processData(opts.config);
  for (const report of config.reports) {
    const parsed_results = [];
    for (const result_options of report.results) {
      if (result_options.type === 'jmeter') {
        parsed_results.push(prp.parse(result_options));
      } else {
        parsed_results.push(trp.parse(result_options));
      }
    }
    for (let i = 0; i < parsed_results.length; i++) {
      const result = parsed_results[i];
      for (const target of report.targets) {
        await target_manager.run(target, result);
      }
    }
  }
}

module.exports = {
  run
}