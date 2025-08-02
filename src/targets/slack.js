const request = require('phin-retry');
const { getPercentage, truncate, getPrettyDuration } = require('../helpers/helper');
const extension_manager = require('../extensions');
const { HOOK, STATUS } = require('../helpers/constants');
const logger = require('../utils/logger');

const PerformanceTestResult = require('performance-results-parser/src/models/PerformanceTestResult');
const { getValidMetrics, getMetricValuesText } = require('../helpers/performance');
const TestResult = require('test-results-parser/src/models/TestResult');
const { BaseTarget } = require('./base.target');

const SLACK_BASE_URL = 'https://slack.com';

const STATUSES = {
  GOOD: ':white_check_mark:',
  WARNING: ':warning:',
  DANGER: ':x:'
}

const COLORS = {
  GOOD: '#36A64F',
  WARNING: '#ECB22E',
  DANGER: '#DC143C'
}

async function run({ result, target }) {
  setTargetInputs(target);
  const payload = getMainPayload();
  if (result instanceof PerformanceTestResult) {
    await setPerformancePayload({ result, target, payload });
  } else {
    await setFunctionalPayload({ result, target, payload });
  }
  const message = getRootPayload({ result, target, payload });
  logger.info(`🔔 Publishing results to Slack...`);
  return publish({ inputs: target.inputs, message });
}

async function setFunctionalPayload({ result, target, payload }) {
  await extension_manager.run({ result, target, payload, hook: HOOK.START });
  setMainBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.AFTER_SUMMARY });
  setSuiteBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.END });
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

function getMainPayload() {
  return {
    "blocks": []
  };
}

function setMainBlock({ result, target, payload }) {
  let text = `*${getTitleText(result, target)}*\n`;
  text += `\n*Results*: ${getResultText(result)}`;
  text += `\n*Duration*: ${getPrettyDuration(result.duration, target.inputs.duration)}`;
  payload.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": text
    }
  });
}

function getTitleText(result, target, {allowTitleLink = true} = {}) {
  let text = target.inputs.title ? target.inputs.title : result.name;
  if (target.inputs.title_suffix) {
    text = `${text} ${target.inputs.title_suffix}`;
  }
  if (allowTitleLink && target.inputs.title_link) {
    text = `<${target.inputs.title_link}|${text}>`;
  }
  if (target.inputs.message_format === 'blocks') {
    if (result.status !== 'PASS') {
      return `${STATUSES.DANGER} ${text}`;
    } else {
      return `${STATUSES.GOOD} ${text}`;
    }
  } else {
    return text;
  }
}

function getResultText(result) {
  const percentage = getPercentage(result.passed, result.total);
  return `${result.passed} / ${result.total} Passed (${percentage}%)`;
}

function setSuiteBlock({ result, target, payload }) {
  let suite_attachments_length = 0;
  if (target.inputs.include_suites) {
    for (let i = 0; i < result.suites.length && suite_attachments_length < target.inputs.max_suites; i++) {
      const suite = result.suites[i];
      if (target.inputs.only_failures && suite.status !== 'FAIL') {
        continue;
      }
      // if suites length eq to 1 then main block will include suite summary
      if (result.suites.length > 1) {
        payload.blocks.push(getSuiteSummary({ target, suite }));
        suite_attachments_length += 1;
      }
      if (target.inputs.include_failure_details) {
        // Only attach failure details block if there were failures
        if (suite.failed > 0) {
          payload.blocks.push(getFailureDetails(suite));
        }
      }
    }
  }
}

function getSuiteSummary({ target, suite }) {
  const tg = new SlackTarget({ target });
  const text = tg.getSuiteSummaryText(target, suite);
  return {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": text
    }
  };
}

function getFailureDetails(suite) {
  let text = '';
  const cases = suite.cases;
  for (let i = 0; i < cases.length; i++) {
    const test_case = cases[i];
    if (test_case.status === 'FAIL') {
      text += `*Test*: ${test_case.name}\n*Error*: ${truncate(test_case.failure ?? 'N/A', 150)}\n\n`;
    }
  }
  return {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": text
    }
  }
}

/**
 *
 * @param {object} param0
 * @param {PerformanceTestResult | TestResult} param0.result
 * @returns
 */
function getRootPayload({ result, target, payload }) {
  let color = COLORS.GOOD;
  if (result.status !== 'PASS') {
    let somePassed = true;
    if (result instanceof PerformanceTestResult) {
      somePassed = result.transactions.some(suite => suite.status === 'PASS');
    } else {
      somePassed = result.suites.some(suite => suite.status === 'PASS');
    }
    if (somePassed) {
      color = COLORS.WARNING;
    } else {
      color = COLORS.DANGER;
    }
  }

  const fallback_text = `${getTitleText(result, target, {allowTitleLink: false})}\nResults: ${getResultText(result)}`;

  if (target.inputs.message_format === 'blocks') {
    return {
      "text": fallback_text,
      "blocks": payload.blocks
    }
  } else {
    return {
      "attachments": [
        {
          "color": color,
          "blocks": payload.blocks,
          "fallback": fallback_text,
        }
      ]
    }
  }
}

async function setPerformancePayload({ result, target, payload }) {
  await extension_manager.run({ result, target, payload, hook: HOOK.START });
  await setPerformanceMainBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.AFTER_SUMMARY });
  await setTransactionBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.END });
}

/**
 *
 * @param {object} param0
 * @param {PerformanceTestResult} param0.result
 */
async function setPerformanceMainBlock({ result, target, payload }) {
  let text = `*${getTitleText(result, target)}*\n`;
  result.total = result.transactions.length;
  result.passed = result.transactions.filter(_transaction => _transaction.status === 'PASS').length;
  text += `\n*Results*: ${getResultText(result)}`;
  const valid_metrics = await getValidMetrics({ metrics: result.metrics, target, result });
  for (let i = 0; i < valid_metrics.length; i++) {
    const metric = valid_metrics[i];
    text += `\n*${metric.name}*: ${getMetricValuesText({ metric, target, result })}`;
  }
  payload.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": text
    }
  });
}

/**
 *
 * @param {object} param0
 * @param {PerformanceTestResult} param0.result
 */
async function setTransactionBlock({ result, target, payload }) {
  if (target.inputs.include_suites) {
    for (let i = 0; i < result.transactions.length; i++) {
      const transaction = result.transactions[i];
      if (target.inputs.only_failures && transaction.status !== 'FAIL') {
        continue;
      }
      // if transactions length eq to 1 then main block will include transaction summary
      if (result.transactions.length > 1) {
        let text = `*${getTitleText(transaction, target)}*\n`;
        const valid_metrics = await getValidMetrics({ metrics: transaction.metrics, target, result });
        for (let i = 0; i < valid_metrics.length; i++) {
          const metric = valid_metrics[i];
          text += `\n*${metric.name}*: ${getMetricValuesText({ metric, target, result })}`;
        }
        payload.blocks.push({
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": text
          }
        });
      }
    }
  }
}


const default_options = {
  condition: STATUS.PASS_OR_FAIL
}

const default_inputs = {
  publish: 'test-summary',
  include_suites: true,
  max_suites: 10,
  only_failures: true,
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
}

async function handleErrors({ target, errors }) {
  let title = 'Error: Reporting Test Results';
  title = target.inputs.title ? title + ' - ' + target.inputs.title : title;

  const blocks = [];

  blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": title
    }
  });
  blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": errors.join('\n\n')
    }
  });

  let payload = {
    "attachments": [
      {
        "color": COLORS.DANGER,
        "blocks": blocks,
        "fallback": title,
      }
    ]
  };

  if (target.inputs.message_format === 'blocks') {
    payload = {
      "text": title, // fallback text
      blocks
    }
  }

  return request.post({
    url: target.inputs.url,
    body: payload
  });
}

async function publish({ inputs, message}) {
  const { url, token, channels } = inputs;
  if (token) {
    for (const channel of channels) {
      message.channel = channel;
      const response = await request.post({
        url: url ? url : `${SLACK_BASE_URL}/api/chat.postMessage`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: message
      });
      if (response && response.ok) {
        logger.info(`✔ Published to Slack channel - ${channel}`);
      } else {
        logger.error(`✖ Failed to publish to Slack channel - ${channel}`);
        logger.error(response);
      }
    }

  } else {
    return request.post({
      url,
      body: message
    });
  }
}


class SlackTarget extends BaseTarget {
  constructor({ target }) {
    super({ target });
  }
}

module.exports = {
  run,
  handleErrors,
  default_options
}
