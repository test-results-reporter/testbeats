const request = require('phin-retry');
const { toColonNotation } = require('colon-notation');
const { getPercentage, truncate } = require('../helpers/helper');
const extension_manager = require('../extensions');

async function run({result, target}) {
  setTargetInputs(target);
  const payload = getMainPayload();
  await extension_manager.run({ result, target, payload, hook: 'start' });
  setTitleBlock(result, { target, payload });
  setMainBlock(result, { target, payload });
  setSuiteBlock(result, { target, payload });
  await extension_manager.run({ result, target, payload, hook: 'end' });
  const message = getRootPayload(payload);
  return request.post({
    url: target.inputs.url,
    body: message
  });
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
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [],
    "actions": []
  };
}

function getTitleText(result, target) {
  const title = target.inputs.title ? target.inputs.title : result.name;
  if (target.inputs.title_suffix) {
    return `${title} ${target.inputs.title_suffix}`;
  }
  return `${title}`;
}

function setTitleBlock(result, { target, payload }) {
  const title = getTitleText(result, target);
  const emoji = result.status === 'PASS' ? '✅' : '❌';
  let text = '';
  if (target.inputs.include_suites === false) {
    text = `${emoji} ${title}`;
  } else if (result.suites.length > 1) {
    text = title;
  } else {
    text = `${emoji} ${title}`;
  }
  payload.body.push({
    "type": "TextBlock",
    "text": text,
    "size": "medium",
    "weight": "bolder"
  });
}

function setMainBlock(result, { payload }) {
  const facts = [];
  const percentage = getPercentage(result.passed, result.total);
  facts.push({
    "title": "Results:",
    "value": `${result.passed} / ${result.total} Passed (${percentage}%)`
  });
  facts.push({
    "title": "Duration:",
    "value": `${toColonNotation(parseInt(result.duration))}`
  });
  payload.body.push({
    "type": "FactSet",
    "facts": facts
  });
}

function setSuiteBlock(result, { target, payload }) {
  if (target.inputs.include_suites) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      if (target.inputs.only_failure_suites && suite.status !== 'FAIL') {
        continue;
      }
      // if suites length eq to 1 then main block will include suite summary
      if (result.suites.length > 1) {
        payload.body.push(...getSuiteSummary(suite));
      }
      if (target.inputs.include_failure_details) {
        payload.body.push(...getFailureDetailsFactSets(suite));
      }
    }
  }
}

function getSuiteSummary(suite) {
  const percentage = getPercentage(suite.passed, suite.total);
  const emoji = suite.status === 'PASS' ? '✅' : '❌';
  return [
    {
      "type": "TextBlock",
      "text": `${emoji} ${suite.name}`,
      "isSubtle": true,
      "weight": "bolder"
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
          "value": `${toColonNotation(parseInt(suite.duration))}`
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

function getRootPayload(payload) {
  return {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": payload
      }
    ]
  };
}

const default_options = {
  condition: 'passOrFail'
}

const default_inputs = {
  publish: 'test-summary',
  include_suites: true,
  only_failure_suites: false,
  include_failure_details: false,
}

module.exports = {
  run,
  default_options
}
