const request = require('phin-retry');
const { getTitleText, getResultText, truncate, getPrettyDuration } = require('../helpers/helper');
const extension_manager = require('../extensions');
const { HOOK, STATUS } = require('../helpers/constants');
const PerformanceTestResult = require('performance-results-parser/src/models/PerformanceTestResult');
const { getValidMetrics, getMetricValuesText } = require('../helpers/performance');

async function run({ result, target }) {
  setTargetInputs(target);
  const root_payload = getRootPayload();
  const payload = root_payload.cards[0];
  if (result instanceof PerformanceTestResult) {
    await setPerformancePayload({ result, target, payload, root_payload });
  } else {
    await setFunctionalPayload({ result, target, payload, root_payload });
  }
  return request.post({
    url: target.inputs.url,
    body: root_payload
  });
}

async function setFunctionalPayload({ result, target, payload, root_payload }) {
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.START });
  setMainBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.AFTER_SUMMARY });
  setSuiteBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.END });
}

function setTargetInputs(target) {
  target.inputs = Object.assign({}, default_inputs, target.inputs);
  if (target.inputs.publish === 'test-summary-slim') {
    target.inputs.include_suites = false;
  }
  if (target.inputs.publish === 'failure-details') {
    target.inputs.include_failure_details = true;
  }
}

function getRootPayload() {
  return {
    "cards": [
      {
        "sections": []
      }
    ]
  };
}

function setMainBlock({ result, target, payload }) {
  const title_text_with_emoji = getTitleTextWithEmoji({ result, target });
  const result_text = getResultText({ result });
  const duration_text = getPrettyDuration(result.duration, target.inputs.duration);

  const text = `<b>${title_text_with_emoji}</b><br><br><b>Results</b>: ${result_text}<br><b>Duration</b>: ${duration_text}`;
  payload.sections.push({
    "widgets": [
      {
        "textParagraph": {
          text
        }
      }
    ]
  });
}

function setSuiteBlock({ result, target, payload }) {
  let suite_attachments_length = 0;
  if (target.inputs.include_suites) {
    let texts = [];
    for (let i = 0; i < result.suites.length && suite_attachments_length < target.inputs.max_suites; i++) {
      const suite = result.suites[i];
      if (target.inputs.only_failures && suite.status !== 'FAIL') {
        continue;
      }
      // if suites length eq to 1 then main block will include suite summary
      if (result.suites.length > 1) {
        texts.push(getSuiteSummary({ target, suite }));
        suite_attachments_length += 1;
      }
      if (target.inputs.include_failure_details) {
        texts.push(getFailureDetails(suite));
      }
    }
    if (texts.length > 0) {
      payload.sections.push({
        "widgets": [
          {
            "textParagraph": {
              "text": texts.join("<br><br>")
            }
          }
        ]
      });
    }
  }
}

function getSuiteSummary({ target, suite }) {
  const emoji = suite.status === 'PASS' ? '✅' : '❌';
  const suite_title = `${emoji} ${suite.name}`;
  const result_text = getResultText({ result: suite });
  const duration_text = getPrettyDuration(suite.duration, target.inputs.duration);
  return `<b>${suite_title}</b><br><br><b>Results</b>: ${result_text}<br><b>Duration</b>: ${duration_text}`;
}

function getFailureDetails(suite) {
  let text = '';
  const cases = suite.cases;
  for (let i = 0; i < cases.length; i++) {
    const test_case = cases[i];
    if (test_case.status === 'FAIL') {
      text += `<b>Test</b>: ${test_case.name}<br><b>Error</b>: ${truncate(test_case.failure, 150)}<br><br>`;
    }
  }
  return text;
}

function getTitleTextWithEmoji({ result, target }) {
  const emoji = result.status === 'PASS' ? '✅' : '❌';
  const title_text = getTitleText({ result, target });

  let title_text_with_emoji = '';
  if (target.inputs.include_suites === false) {
    title_text_with_emoji = `${emoji} ${title_text}`;
  } else if (result.suites && result.suites.length > 1 || result.transactions && result.transactions.length > 1) {
    title_text_with_emoji = title_text;
  } else {
    title_text_with_emoji = `${emoji} ${title_text}`;
  }
  if (target.inputs.title_link) {
    title_text_with_emoji = `<a href="${target.inputs.title_link}">${title_text_with_emoji}</a>`;
  }
  return title_text_with_emoji;
}

async function setPerformancePayload({ result, target, payload, root_payload }) {
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.START });
  await setPerformanceMainBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.AFTER_SUMMARY });
  await setTransactionBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.END });
}

/**
 * 
 * @param {object} param0
 * @param {PerformanceTestResult} param0.result 
 */
async function setPerformanceMainBlock({ result, target, payload }) {
  const title_text_with_emoji = getTitleTextWithEmoji({ result, target });
  const result_text = getResultText({ result });
  let text = `<b>${title_text_with_emoji}</b><br><br><b>Results</b>: ${result_text}<br>`;
  const valid_metrics = await getValidMetrics({ metrics: result.metrics, target, result });
  for (let i = 0; i < valid_metrics.length; i++) {
    const metric = valid_metrics[i];
    text += `<br><b>${metric.name}</b>: ${getMetricValuesText({ metric, target, result })}`;
  }
  payload.sections.push({
    "widgets": [
      {
        "textParagraph": {
          text
        }
      }
    ]
  });
}

/**
 * 
 * @param {object} param0
 * @param {PerformanceTestResult} param0.result 
 */
async function setTransactionBlock({ result, target, payload }) {
  if (target.inputs.include_suites) {
    let texts = [];
    for (let i = 0; i < result.transactions.length; i++) {
      const transaction = result.transactions[i];
      if (target.inputs.only_failures && transaction.status !== 'FAIL') {
        continue;
      }
      // if transactions length eq to 1 then main block will include suite summary
      if (result.transactions.length > 1) {
        texts.push(await getTransactionSummary({ target, transaction,  }));
      }
    }
    if (texts.length > 0) {
      payload.sections.push({
        "widgets": [
          {
            "textParagraph": {
              "text": texts.join("<br><br>")
            }
          }
        ]
      });
    }
  }
}

async function getTransactionSummary({ target, transaction }) {
  const emoji = transaction.status === 'PASS' ? '✅' : '❌';
  const suite_title = `${emoji} ${transaction.name}`;
  let text = `<b>${suite_title}</b><br>`;
  const valid_metrics = await getValidMetrics({ metrics: transaction.metrics, target, result: transaction });
  for (let i = 0; i < valid_metrics.length; i++) {
    const metric = valid_metrics[i];
    text += `<br><b>${metric.name}</b>: ${getMetricValuesText({ metric, target })}`;
  }
  return text;
}


const default_options = {
  condition: STATUS.PASS_OR_FAIL
};

const default_inputs = {
  publish: 'test-summary',
  include_suites: true,
  max_suites: 10,
  only_failures: false,
  include_failure_details: false,
  duration: '',
  metrics: [
    {
      "name": "Samples",
    },
    {
      "name": "Duration",
      "condition": "always",
      "fields": ["avg", "p95"]
    }
  ]
};

module.exports = {
  run,
  default_options
}