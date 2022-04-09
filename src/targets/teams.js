const request = require('phin-retry');
const { toColonNotation } = require('colon-notation');
const { getPercentage, getReportType, getUrl, truncate } = require('../helpers/helper');
const extensions = require('../extensions');

function getTitleText(result, options) {
  const title = options.title ? options.title : result.name;
  if (options.title_suffix) {
    return `${title} ${options.title_suffix}`;
  }
  return `${title}`;
}

function getTitleTextBlock(testResult, opts) {
  const title = getTitleText(testResult, opts);
  const emoji = testResult.status === 'PASS' ? '✅' : '❌';
  const report = getReportType(opts);
  let text = '';
  if (report.includes('slim')) {
    text = `${emoji} ${title}`;
  } else if (testResult.suites.length > 1) {
    text = title;
  } else {
    text = `${emoji} ${title}`;
  }
  return {
    "type": "TextBlock",
    "text": text,
    "size": "medium",
    "weight": "bolder"
  }
}

function getMainSummary(result) {
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
  return {
    "type": "FactSet",
    "facts": facts
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

function getLinks(opts) {
  const links = [];
  for (const link of opts.links) {
    links.push(`[${link.text}](${link.url})`);
  }
  return {
    "type": "TextBlock",
    "text": links.join(' ｜ '),
    "separator": true
  }
}

function getPayloadRoot() {
  return {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [],
    "actions": []
  };
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

function attachLinks(adaptive, opts) {
  if (opts.links) {
    adaptive.body.push(getLinks(opts));
  }
}

/**
 * lifecycle hooks
 */

async function lifecycle({ options, hook, payload, result }) {
  const _extensions = getExtensions(options.extensions, hook);
  for (let i = 0; i < _extensions.length; i++) {
    const _extension = _extensions[i];
    if (_extension.condition.includes(result.status.toLowerCase())) {
      await extensions.run(_extension, { payload, result, options });
    }
  }
}

function getExtensions(_extensions, hook) {
  return _extensions ? _extensions.filter(_ext => _ext.hook === hook) : [];
}

/**
 * messages
 */

async function getTestSummaryMessage(testResults, options) {
  const result = testResults[0];
  const payload = getPayloadRoot();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.body.push(getTitleTextBlock(result, options));
  payload.body.push(getMainSummary(result));
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      payload.body.push(...getSuiteSummary(suite));
    }
  }
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  const root_payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": payload
      }
    ]
  };
  return root_payload;
}

async function getFailureSummaryMessage(testResults, options) {
  const result = testResults[0];
  if (result.status === 'PASS') {
    return null;
  }
  const payload = getPayloadRoot();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.body.push(getTitleTextBlock(result, options));
  payload.body.push(getMainSummary(result));
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      if (suite.status === 'FAIL') {
        payload.body.push(...getSuiteSummary(suite));
      }
    }
  }
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  const root_payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": payload
      }
    ]
  };
  return root_payload;
}

async function getTestSummarySlimMessage(testResults, options) {
  const result = testResults[0];
  const payload = getPayloadRoot();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.body.push(getTitleTextBlock(result, options));
  payload.body.push(getMainSummary(result));
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  const root_payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": payload
      }
    ]
  };
  return root_payload;
}

async function getFailureSummarySlimMessage(testResults, options) {
  const result = testResults[0];
  if (result.status === 'PASS') {
    return null;
  }
  const payload = getPayloadRoot();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.body.push(getTitleTextBlock(result, options));
  payload.body.push(getMainSummary(result));
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  const root_payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": payload
      }
    ]
  };
  return root_payload;
}

async function getFailureDetailsMessage(results, options) {
  const result = results[0];
  if (result.status === 'PASS') {
    return null;
  }
  const payload = getPayloadRoot();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.body.push(getTitleTextBlock(result, options));
  payload.body.push(getMainSummary(result));
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      payload.body.push(...getSuiteSummary(suite));
      if (suite.status === 'FAIL') {
        payload.body.push(...getFailureDetailsFactSets(suite));
      }
    }
  } else {
    const suite = result.suites[0];
    payload.body.push(...getFailureDetailsFactSets(suite));
  }
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  const root_payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": payload
      }
    ]
  };
  return root_payload;
}

async function getFailureDetailsSlimMessage(results, options) {
  const result = results[0];
  if (result.status === 'PASS') {
    return null;
  }
  const payload = getPayloadRoot();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.body.push(getTitleTextBlock(result, options));
  payload.body.push(getMainSummary(result));
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      if (suite.status === 'FAIL') {
        payload.body.push(...getSuiteSummary(suite));
        payload.body.push(...getFailureDetailsFactSets(suite));
      }
    }
  } else {
    const suite = result.suites[0];
    payload.body.push(...getFailureDetailsFactSets(suite));
  }
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  const root_payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": payload
      }
    ]
  };
  return root_payload;
}

function getMessage(options, results) {
  const report = getReportType(options);
  switch (report) {
    case 'test-summary':
      return getTestSummaryMessage(results, options);
    case 'failure-summary':
      return getFailureSummaryMessage(results, options);
    case 'test-summary-slim':
      return getTestSummarySlimMessage(results, options);
    case 'failure-summary-slim':
      return getFailureSummarySlimMessage(results, options);
    case 'failure-details':
      return getFailureDetailsMessage(results, options);
    case 'failure-details-slim':
      return getFailureDetailsSlimMessage(results, options);
    default:
      console.log('UnSupported Report Type');
      break;
  }
}

async function send(options, results) {
  const message = await getMessage(options, results);
  if (message) {
    return request.post({
      url: getUrl(options),
      body: message
    });
  }
}

module.exports = {
  send
}
