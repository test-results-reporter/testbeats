const path = require('path');
const { parse } = require('test-results-parser');
const { processData } = require('../helpers/helper');
const targets = require('../targets');
const extensions = require('../extensions');

function setDefaultsForExtensions(options) {
  const _extensions = options.extensions ? options.extensions : [];
  // backward compatibility
  if (options.report_portal_analysis) {
    _extensions.push({
      name: 'report-portal-analysis',
      options: options.report_portal_analysis
    });
  }
  for (let i = 0; i < _extensions.length; i++) {
    const _extension = _extensions[i];
    extensions.setDefaults(_extension);
  }
}

async function run(opts) {
  if (typeof opts.config === 'string') {
    const cwd = process.cwd();
    opts.config = require(path.join(cwd, opts.config));
  }
  const config = processData(opts.config);
  const testResults = [];
  for (const report of config.reports) {
    for (const result of report.results) {
      testResults.push(parse(result));
    }
    const globalOpts = report.options || {};
    for (const target of report.targets) {
      const clonedGlobalOpts = Object.assign({}, globalOpts);
      const options = Object.assign(clonedGlobalOpts, target);
      setDefaultsForExtensions(options);
      await targets.send(options, testResults);
    }
  }
}

module.exports = {
  run
}