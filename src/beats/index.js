const request = require('phin-retry');
const TestResult = require('test-results-parser/src/models/TestResult');
const { getCIInformation } = require('../helpers/ci');
const { HOOK } = require('../helpers/constants');

function get_base_url() {
  return process.env.TEST_BEATS_URL || "https://app.testbeats.com";
}

/**
 * @param {import('../index').PublishReport} config
 * @param {TestResult} result
 */
async function run(config, result) {
  init(config);
  if (isValid(config)) {
    const run_id = await publishTestResults(config, result);
    if (run_id) {
      attachTestBeatsReportHyperLink(config, run_id);
      await attachTestBeatsFailureSummary(config, result, run_id);
    }
  } else {
    console.warn('Missing testbeats config parameters');
  }
}

/**
 *
 * @param {import('../index').PublishReport} config
 */
function init(config) {
  config.project = config.project || process.env.TEST_BEATS_PROJECT;
  config.run = config.run || process.env.TEST_BEATS_RUN;
  config.api_key = config.api_key || process.env.TEST_BEATS_API_KEY;
}

/**
 *
 * @param {import('../index').PublishReport} config
 */
function isValid(config) {
  return config.project && config.run && config.api_key
}

/**
 * @param {import('../index').PublishReport} config
 * @param {TestResult} result
 */
async function publishTestResults(config, result) {
  console.log("Publishing results to TestBeats");
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
 * @param {import('../index').PublishReport} config
 * @param {TestResult} result
 * @param {string} run_id
 */
async function attachTestBeatsFailureSummary(config, result, run_id) {
  if (result.status !== 'FAIL') {
    return;
  }
  if (config.show_failure_summary === false) {
    return;
  }
  try {
    await processFailureSummary(config, run_id);
  } catch (error) {
    console.log(error);
    console.log("error processing failure summary");
  }
}

async function processFailureSummary(config, run_id) {
  let retry = 3;
  while (retry > 0) {
    const test_run = await getTestRun(config, run_id);
    if (test_run && test_run.failure_summary_status) {
      if (test_run.failure_summary_status === 'COMPLETED') {
        addAIFailureSummaryExtension(config, test_run);
        return;
      } else if (test_run.failure_summary_status === 'FAILED') {
        console.log(`Test run failure summary failed`);
        return;
      } else if (test_run.failure_summary_status === 'SKIPPED') {
        console.log(`Test run failure summary failed`);
        return;
      }
    }
    console.log(`Test run failure summary not completed, retrying...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    retry = retry - 1;
  }
}

/**
 * @param {import('../index').PublishReport} config
 * @param {string} run_id
 */
function getTestRun(config, run_id) {
  return request.get({
    url: `${get_base_url()}/api/core/v1/test-runs/key?id=${run_id}`,
    headers: {
      'x-api-key': config.api_key
    }
  });
}

function getAIFailureSummaryExtension(test_run) {
  const execution_metric = test_run.execution_metrics[0];
  return {
    name: 'ai-failure-summary',
    hook: HOOK.AFTER_SUMMARY,
    inputs: {
      failure_summary: execution_metric.failure_summary
    }
  };
}

function addAIFailureSummaryExtension(config, test_run) {
  const extension = getAIFailureSummaryExtension(test_run);
  if (config.targets) {
    for (const target of config.targets) {
      target.extensions = target.extensions || [];
      target.extensions.push(extension);
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