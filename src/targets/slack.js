const request = require('phin-retry');
const { getPercentage, truncate, getPrettyDuration } = require('../helpers/helper');
const extension_manager = require('../extensions');
const { HOOK } = require('../helpers/constants');

const COLORS = {
  GOOD: '#36A64F',
  WARNING: '#ECB22E',
  DANGER: '#DC143C'
}

async function run({ result, target }) {
  setTargetInputs(target);
  const payload = getMainPayload();
  await extension_manager.run({ result, target, payload, hook: HOOK.START });
  setMainBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.POST_MAIN });
  setSuiteBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.END });
  const message = getRootPayload({ result, payload });
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

function getTitleText(result, target) {
  let text = target.inputs.title ? target.inputs.title : result.name;
  if (target.inputs.title_suffix) {
    text = `${text} ${target.inputs.title_suffix}`;
  }
  if (target.inputs.title_link) {
    text = `<${target.inputs.title_link}|${text}>`;
  }
  return text;
}

function getResultText(result) {
  const percentage = getPercentage(result.passed, result.total);
  return `${result.passed} / ${result.total} Passed (${percentage}%)`;
}

function setSuiteBlock({ result, target, payload }) {
  if (target.inputs.include_suites) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      if (target.inputs.only_failure_suites && suite.status !== 'FAIL') {
        continue;
      }
      // if suites length eq to 1 then main block will include suite summary
      if (result.suites.length > 1) {
        payload.blocks.push(getSuiteSummary({ target, suite }));
      }
      if (target.inputs.include_failure_details) {
        // Only attach failure details block if there were failures
        if (result.failed > 0 ) {
          payload.blocks.push(getFailureDetails(suite));
        }
      }
    }
  }
}

function getSuiteSummary({ target, suite }) {
  let text = `*${getSuiteTitle(suite)}*\n`;
  text += `\n*Results*: ${getResultText(suite)}`;
  text += `\n*Duration*: ${getPrettyDuration(suite.duration, target.inputs.duration )}`;
  return {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": text
    }
  };
}

function getSuiteTitle(suite) {
  const emoji = suite.status === 'PASS' ? '✅' : '❌';
  return `${emoji} ${suite.name}`;
}

function getFailureDetails(suite) {
  let text = '';
  const cases = suite.cases;
  for (let i = 0; i < cases.length; i++) {
    const test_case = cases[i];
    if (test_case.status === 'FAIL') {
      text += `*Test*: ${test_case.name}\n*Error*: ${truncate(test_case.failure, 150)}\n\n`;
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

function getRootPayload({ result, payload }) {
  let color = COLORS.GOOD;
  if (result.status !== 'PASS') {
    const somePassed = result.suites.some(suite => suite.status === 'PASS');
    if (somePassed) {
      color = COLORS.WARNING;
    } else {
      color = COLORS.DANGER;
    }
  }
  return {
    "attachments": [
      {
        "color": color,
        "blocks": payload.blocks
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
  duration: 'colonNotation'
}

module.exports = {
  run,
  default_options
}
