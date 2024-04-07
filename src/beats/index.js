const request = require('phin-retry');
const TestResult = require('test-results-parser/src/models/TestResult');
const { getCIInformation } = require('../helpers/ci');

function get_base_url() {
  return process.env.TEST_BEATS_URL || "https://app.testbeats.com";
}

/**
 * @param {import('../index').PublishReport} config
 * @param {TestResult} result
 */
async function run(config, result) {
  if (config.project && config.run && config.api_key) {
    const run_id = await publishTestResults(config, result);
    if (run_id) {
      attachTestBeatsReportHyperLink(config, run_id);
    }
  }
}

/**
 * @param {import('../index').PublishReport} config 
 * @param {TestResult} result
 */
async function publishTestResults(config, result) {
  try {
    const payload = {
      project: config.project,
      run: config.run,
      ...result
    }
    const ci = getCIInformation();
    if (ci) {
      payload.ci_details = [ci];
    }
    
    const response = await request.post({
      url: `${get_base_url()}/api/core/v1/test-runs`,
      headers: {
        'x-api-key': config.api_key
      },
      body: payload
    });
    return response.id;
  } catch (error) {
    console.log("Unable to publish results to TestBeats");
    console.log(error);
  }
}

/**
 * @param {import('../index').PublishReport} config
 * @param {string} run_id
 */
function attachTestBeatsReportHyperLink(config, run_id) {
  const beats_link = get_test_beats_report_link(run_id);
  if (config.targets) {
    for (const target of config.targets) {
      target.inputs.title_link = beats_link;
    }
  }
}

/**
 * 
 * @param {string} run_id 
 * @returns 
 */
function get_test_beats_report_link(run_id) {
  return `${get_base_url()}/reports/${run_id}`;
}

module.exports = { run }