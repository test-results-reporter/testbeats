const request = require('phin-retry');
const TestResult = require('test-results-parser/src/models/TestResult');
const { getCIInformation } = require('../helpers/ci');

const BASE_URL = process.env.TEST_BEATS_URL || "http://localhost:9393";

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
      url: `${BASE_URL}/api/core/v1/test-runs`,
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
  const hyperlink_to_test_beats = getTestBeatsReportHyperLink(run_id);
  for (const target of config.targets) {
    if (target.name === 'chat' || target.name === 'teams' || target.name === 'slack') {
      target.extensions = target.extensions || [];
      if (target.extensions.length > 0) {
        if (target.extensions[0].name === 'hyperlinks' && target.extensions[0].inputs.links[0].name === 'Test Beats Report') {
          target.extensions[0].inputs.links[0].url = `${BASE_URL}/reports/${run_id}`;
          continue;
        }
      }
      target.extensions = [hyperlink_to_test_beats, ...target.extensions];
    }
  }
}

/**
 * 
 * @param {string} run_id 
 * @returns 
 */
function getTestBeatsReportHyperLink(run_id) {
  return {
    "name": "hyperlinks",
    "inputs": {
      "links": [
        {
          "text": "Test Beats Report",
          "url": `${BASE_URL}/reports/${run_id}`
        }
      ]
    }
  }
}

module.exports = { run }