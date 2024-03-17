const hyperlinks = require('./hyperlinks');
const mentions = require('./mentions');
const rp_analysis = require('./report-portal-analysis');
const rp_history = require('./report-portal-history');
const qc_test_summary = require('./quick-chart-test-summary');
const percy_analysis = require('./percy-analysis');
const custom = require('./custom');
const metadata = require('./metadata');
const ci_info = require('./ci-info');
const { EXTENSION } = require('../helpers/constants');
const { checkCondition } = require('../helpers/helper');

async function run(options) {
  const { target, result, hook } = options;
  const extensions = target.extensions || [];
  for (let i = 0; i < extensions.length; i++) {
    const extension = extensions[i];
    const extension_runner = getExtensionRunner(extension);
    const extension_options = Object.assign({}, extension_runner.default_options, extension);
    if (extension_options.hook === hook) {
      if (await checkCondition({ condition: extension_options.condition, result, target, extension })) {
        extension.outputs = {};
        options.extension = extension;
        try {
          await extension_runner.run(options);
        } catch (error) {
          console.log('Failed to run extension');
          console.log(extension);
          console.log(error);
        }
      }
    }
  }
}

function getExtensionRunner(extension) {
  switch (extension.name) {
    case EXTENSION.HYPERLINKS:
      return hyperlinks;
    case EXTENSION.MENTIONS:
      return mentions;
    case EXTENSION.REPORT_PORTAL_ANALYSIS:
      return rp_analysis;
    case EXTENSION.REPORT_PORTAL_HISTORY:
      return rp_history;
    case EXTENSION.QUICK_CHART_TEST_SUMMARY:
      return qc_test_summary;
    case EXTENSION.PERCY_ANALYSIS:
      return percy_analysis;
    case EXTENSION.CUSTOM:
      return custom;
    case EXTENSION.METADATA:
      return metadata;
    case EXTENSION.CI_INFO:
      return ci_info;
    default:
      return require(extension.name);
  }
}

module.exports = {
  run
}