const request = require('phin-retry');
const { getTitleText, getResultText, getPercentage, truncate, getPrettyDuration } = require('../helpers/helper');
const extension_manager = require('../extensions');
const { HOOK } = require('../helpers/constants');

async function run({ result, target }) {
  setTargetInputs(target);
  const root_payload = getRootPayload();
  const payload = root_payload.cards[0];
  await extension_manager.run({ result, target, payload, root_payload, hook: HOOK.START });
  setMainBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.POST_MAIN });
  setSuiteBlock({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.END });
  return request.post({
    url: target.inputs.url,
    body: root_payload
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
  const emoji = result.status === 'PASS' ? '✅' : '❌';
  const title_text = getTitleText({ result, target });
  const result_text = getResultText({ result });
  const duration_text = getPrettyDuration(result.duration, target.inputs.duration);

  let title_text_with_emoji = '';
  if (target.inputs.include_suites === false) {
    title_text_with_emoji = `${emoji} ${title_text}`;
  } else if (result.suites.length > 1) {
    title_text_with_emoji = title_text;
  } else {
    title_text_with_emoji = `${emoji} ${title_text}`;
  }
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
  if (target.inputs.include_suites) {
    let texts = [];
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      if (target.inputs.only_failure_suites && suite.status !== 'FAIL') {
        continue;
      }
      // if suites length eq to 1 then main block will include suite summary
      if (result.suites.length > 1) {
        texts.push(getSuiteSummary({ target, suite }));

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

const default_options = {
  condition: 'passOrFail'
};

const default_inputs = {
  publish: 'test-summary',
  include_suites: true,
  only_failure_suites: false,
  include_failure_details: false,
  duration: 'colonNotation'
};

module.exports = {
  run,
  default_options
}