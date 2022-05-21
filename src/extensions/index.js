const hyperlinks = require('./hyperlinks');
const mentions = require('./mentions');
const rp_analysis = require('./report-portal-analysis');
const rp_history = require('./report-portal-history');
const qc_test_summary = require('./quick-chart-test-summary');

async function run(options) {
  const { target, result, hook } = options;
  const extensions = target.extensions || [];
  for (let i = 0; i < extensions.length; i++) {
    const extension = extensions[i];
    const extension_runner = getExtensionRunner(extension);
    const extension_options = Object.assign({}, extension_runner.default_options, extension);
    if (extension_options.hook === hook) {
      if (extension_options.condition.toLowerCase().includes(result.status.toLowerCase())) {
        options.extension = extension;
        await extension_runner.run(options);
      }
    }
  }
}

function getExtensionRunner(extension) {
  switch (extension.name) {
    case 'hyperlinks':
      return hyperlinks;
    case 'mentions':
      return mentions;
    case 'report-portal-analysis':
      return rp_analysis;
    case 'report-portal-history':
      return rp_history;
    case 'quick-chart-test-summary':
      return qc_test_summary;
    default:
      return require(extension.name);
  }
}

module.exports = {
  run
}