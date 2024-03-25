const request = require('phin-retry');
const { getPercentage, truncate, getPrettyDuration } = require('../helpers/helper');
const { getValidMetrics, getMetricValuesText } = require('../helpers/performance');
const extension_manager = require('../extensions');
const { HOOK, STATUS } = require('../helpers/constants');

const TestResult = require('test-results-parser/src/models/TestResult');
const PerformanceTestResult = require('performance-results-parser/src/models/PerformanceTestResult');

/**
 * @param {object} param0 
 * @param {PerformanceTestResult | TestResult} param0.result 
 * @returns 
 */
async function run({ result, target }) {
  setTargetInputs(target);
  const root_payload = getRootPayload();
  const payload = getMainPayload(target);
  if (result instanceof PerformanceTestResult) {
    await setPerformancePayload({ result, target, payload, root_payload });
  } else {
    await setFunctionalPayload({ result, target, payload, root_payload });
  }
  setRootPayload(root_payload, payload);
  return request.post({
    url: target.inputs.url,
    body: root_payload
  });
}

async function setPerformancePayload({ result, target, payload, root_payload }) {
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.START });
  setTitleBlock({ result, target, payload });
  await setMainBlockForPerformance({ result, target, payload });
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.AFTER_SUMMARY });
  await setTransactionBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.END });
}

async function setFunctionalPayload({ result, target, payload, root_payload }) {
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.START });
  setTitleBlock({ result, target, payload });
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

function getMainPayload(target) {
  const main = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [],
    "actions": []
  };
  if (target.inputs.width) {
    if (!main.msteams) {
      main.msteams = {};
    }
    main.msteams.width = target.inputs.width;
  }
  return main;
}

function getTitleText(result, target) {
  const title = target.inputs.title ? target.inputs.title : result.name;
  if (target.inputs.title_suffix) {
    return `${title} ${target.inputs.title_suffix}`;
  }
  return `${title}`;
}

function setTitleBlock({ result, target, payload }) {
  const title = getTitleText(result, target);
  const emoji = result.status === 'PASS' ? '✅' : '❌';
  let text = '';
  if (target.inputs.include_suites === false) {
    text = `${emoji} ${title}`;
  } else if (result.suites && result.suites.length > 1 || result.transactions && result.transactions.length > 1) {
    text = title;
  } else {
    text = `${emoji} ${title}`;
  }
  if (target.inputs.title_link) {
    text = `[${text}](${target.inputs.title_link})`
  }
  payload.body.push({
    "type": "TextBlock",
    "text": text,
    "size": "medium",
    "weight": "bolder",
    "wrap": true
  });
}

function setMainBlock({ result, target, payload }) {
  const facts = [];
  const percentage = getPercentage(result.passed, result.total);
  facts.push({
    "title": "Results:",
    "value": `${result.passed} / ${result.total} Passed (${percentage}%)`
  });
  facts.push({
    "title": "Duration:",
    "value": `${getPrettyDuration(result.duration, target.inputs.duration)}`
  });
  payload.body.push({
    "type": "FactSet",
    "facts": facts
  });
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
        payload.body.push(...getSuiteSummary({ suite, target }));
        suite_attachments_length += 1;
      }
      if (target.inputs.include_failure_details) {
        payload.body.push(...getFailureDetailsFactSets(suite));
      }
    }
  }
}

function getSuiteSummary({ suite, target }) {
  const percentage = getPercentage(suite.passed, suite.total);
  const emoji = suite.status === 'PASS' ? '✅' : '❌';
  return [
    {
      "type": "TextBlock",
      "text": `${emoji} ${suite.name}`,
      "isSubtle": true,
      "weight": "bolder",
      "wrap": true
    },
    {
      "type": "FactSet",
      "facts": [
        {
          "title": "Results:",
          "value": `${suite.passed} / ${suite.total} Passed (${percentage}%)`
        },
        {
          "title": "Duration:",
          "value": `${getPrettyDuration(suite.duration, target.inputs.duration)}`
        }
      ]
    }
  ]
}

function getFailureDetailsFactSets(suite) {
  const fact_sets = [];
  const cases = suite.cases;
  for (let i = 0; i < cases.length; i++) {
    const test_case = cases[i];
    if (test_case.status === 'FAIL') {
      fact_sets.push({
        "type": "FactSet",
        "facts": [
          {
            "title": "Test:",
            "value": test_case.name
          },
          {
            "title": "Error:",
            "value": truncate(test_case.failure, 150)
          }
        ]
      });
    }
  }
  return fact_sets;
}

function getRootPayload() {
  return {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": ''
      }
    ]
  };
}

function setRootPayload(root_payload, payload) {
  root_payload.attachments[0].content = payload;
}

/**
 * @param {object} param0 
 * @param {PerformanceTestResult} param0.result 
 */
async function setMainBlockForPerformance({ result, target, payload }) {
  const total = result.transactions.length;
  const passed = result.transactions.filter(_transaction => _transaction.status === 'PASS').length;
  const percentage = getPercentage(passed, total);
  payload.body.push({
    "type": "FactSet",
    "facts": [
      {
        "title": "Results:",
        "value": `${passed} / ${total} Passed (${percentage}%)`
      }
    ]
  });
  payload.body.push({
    "type": "FactSet",
    "facts": await getFactMetrics({ metrics: result.metrics, result, target })
  });
}

async function getFactMetrics({ metrics, target, result }) {
  const facts = [];
  const valid_metrics = await getValidMetrics({ metrics, target, result });
  for (let i = 0; i < valid_metrics.length; i++) {
    const metric = valid_metrics[i];
    facts.push({
      "title": `${metric.name}:`,
      "value": getMetricValuesText({ metrics, metric, target, result })
    })
  }
  return facts;
}

/**
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
        const emoji = transaction.status === 'PASS' ? '✅' : '❌';
        payload.body.push({
          "type": "TextBlock",
          "text": `${emoji} ${transaction.name}`,
          "isSubtle": true,
          "weight": "bolder",
          "wrap": true
        });
        payload.body.push({
          "type": "FactSet",
          "facts": await getFactMetrics({ metrics: transaction.metrics, result, target })
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
  only_failures: false,
  include_failure_details: false,
  width: '',
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

module.exports = {
  run,
  default_options
}
