const request = require('phin-retry');
const { getUrl, getReportType, getPercentage, truncate } = require('../helpers/helper');
const { toColonNotation } = require('colon-notation');
const extensions = require('../extensions');

function getRootPayload() {
  return {
    "attachments": []
  };
}

function getTitleText(result, options) {
  const title = options.title ? options.title : result.name;
  if (options.title_suffix) {
    return `*${title} ${options.title_suffix}*`;
  }
  return `*${title}*`;
}

function getMainSummary(result) {
  const color = result.status === 'PASS' ? 'good' : 'danger';
  const percentage = getPercentage(result.passed, result.total);
  return {
    "mrkdwn_in": ["text", "fields"],
    "color": color,
    "fields": [
      {
        "title": "Results",
        "value": `${result.passed} / ${result.total} Passed (${percentage}%)`,
        "short": true
      },
      {
        "title": "Duration",
        "value": `${toColonNotation(parseInt(result.duration))}`,
        "short": true
      }
    ]
  }
}

function getSuiteSummary(suite) {
  const color = suite.status === 'PASS' ? 'good' : 'danger';
  const percentage = getPercentage(suite.passed, suite.total);
  return {
    "text": `*${suite.name}*`,
    "mrkdwn_in": ["text", "fields"],
    "color": color,
    "fields": [
      {
        "title": "Results",
        "value": `${suite.passed} / ${suite.total} Passed (${percentage}%)`,
        "short": true
      },
      {
        "title": "Duration",
        "value": `${toColonNotation(parseInt(suite.duration))}`,
        "short": true
      }
    ]
  }
}

function getLinks(options) {
  const links = [];
  for (const link of options.links) {
    links.push(`<${link.url}|${link.text}>`);
  }
  return {
    "fallback": "links",
    "footer": links.join(' ｜ ')
  }
}

function getFailureDetailsFields(suite) {
  const fields = [];
  const cases = suite.cases;
  for (let i = 0; i < cases.length; i++) {
    const test_case = cases[i];
    if (test_case.status === 'FAIL') {
      const message = `*Test*: ${test_case.name}\n*Error*: ${truncate(test_case.failure, 150)}`;
      fields.push({ value: message });
    }
  }
  return fields;
}

function attachLinks(payload, options) {
  if (options.links) {
    payload.attachments.push(getLinks(options));
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

async function getTestSummaryMessage(results, options) {
  const result = results[0];
  const payload = getRootPayload();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.text = getTitleText(result, options);
  payload.attachments.push(getMainSummary(result));
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      payload.attachments.push(getSuiteSummary(suite));
    }
  }
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  return payload;
}

async function getFailureSummaryMessage(results, options) {
  const result = results[0];
  if (result.status === 'PASS') {
    return null;
  }
  const payload = getRootPayload();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.text = getTitleText(result, options);
  payload.attachments.push(getMainSummary(result));
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      if (suite.status === 'FAIL') {
        payload.attachments.push(getSuiteSummary(suite));
      }
    }
  }
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  return payload;
}

async function getTestSummarySlimMessage(results, options) {
  const result = results[0];
  const payload = getRootPayload();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.text = getTitleText(result, options);
  payload.attachments.push(getMainSummary(result));
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  return payload;
}

async function getFailureSummarySlimMessage(results, options) {
  const result = results[0];
  if (result.status === 'PASS') {
    return null;
  }
  const payload = getRootPayload();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.text = getTitleText(result, options);
  payload.attachments.push(getMainSummary(result));
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  return payload;
}

async function getFailureDetailsMessage(results, options) {
  const result = results[0];
  if (result.status === 'PASS') {
    return null;
  }
  const payload = getRootPayload();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.text = getTitleText(result, options);
  const mainSummary = getMainSummary(result);
  payload.attachments.push(mainSummary);
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      const suiteSummary = getSuiteSummary(suite);
      if (suite.status === 'FAIL') {
        suiteSummary.fields = suiteSummary.fields.concat(getFailureDetailsFields(suite));
      }
      payload.attachments.push(suiteSummary);
    }
  } else {
    const suite = result.suites[0];
    mainSummary.fields = mainSummary.fields.concat(getFailureDetailsFields(suite));
  }
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  return payload;
}

async function getFailureDetailsSlimMessage(results, options) {
  const result = results[0];
  if (result.status === 'PASS') {
    return null;
  }
  const payload = getRootPayload();
  await lifecycle({ options, payload, result, hook: 'start' });
  payload.text = getTitleText(result, options);
  const mainSummary = getMainSummary(result);
  payload.attachments.push(mainSummary);
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      if (suite.status === 'FAIL') {
        const suiteSummary = getSuiteSummary(suite);
        suiteSummary.fields = suiteSummary.fields.concat(getFailureDetailsFields(suite));
        payload.attachments.push(suiteSummary);
      }
    }
  } else {
    const suite = result.suites[0];
    mainSummary.fields = mainSummary.fields.concat(getFailureDetailsFields(suite));
  }
  await lifecycle({ options, payload, result, hook: 'post-main' });
  attachLinks(payload, options);
  await lifecycle({ options, payload, result, hook: 'end' });
  return payload;
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
