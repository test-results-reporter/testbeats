const request = require('phin-retry');
const { toColonNotation } = require('colon-notation');
const { getPercentage } = require('../helpers/helper');

function getTitleTextBlock(testResult, opts) {
  const title = opts.title ? opts.title : testResult.name;
  const emoji = testResult.status === 'PASS' ? '✅' : '❌';
  return {
    "type": "TextBlock",
    "text": `${emoji} ${title}`,
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
  return [
    {
      "type": "TextBlock",
      "text": suite.name,
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
    "text": links.join(' | '),
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

function getTestSummaryMessage(testResults, opts) {
  const testResult = testResults[0];
  const adaptive = getPayloadRoot();
  adaptive.body.push(getTitleTextBlock(testResult, opts));
  adaptive.body.push(getMainSummary(testResult));
  if (testResult.suites.length > 1) {
    for (let i = 0; i < testResult.suites.length; i++) {
      const suite = testResult.suites[i];
      adaptive.body.push(...getSuiteSummary(suite));
    }
  }
  if (opts.links) {
    adaptive.body.push(getLinks(opts));
  }
  const payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": adaptive
      }
    ]
  };
  return payload;
}

function getTestSummarySlimMessage(testResults, opts) {
  const testResult = testResults[0];
  const adaptive = getPayloadRoot();
  adaptive.body.push(getTitleTextBlock(testResult, opts));
  adaptive.body.push(getMainSummary(testResult));
  if (opts.links) {
    adaptive.body.push(getLinks(opts));
  }
  const payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": adaptive
      }
    ]
  };
  return payload;
}

function getReportType(options) {
  if (options) {
    if (options.publish) return options.publish;
  }
  return 'test-summary';
}

function getMessage(options, results) {
  const report = getReportType(options);
  switch (report) {
    case 'test-summary':
      return getTestSummaryMessage(results, options);
    case 'test-summary-slim':
      return getTestSummarySlimMessage(results, options);
    default:
      console.log('UnSupported Report Type');
      break;
  }
}

function getUrl(options) {
  return options.url || options.webhook || options['incoming-webhook-url'];
}

function send(options, results) {
  const message = getMessage(options, results);
  return request.post({
    url: getUrl(options),
    body: message
  });
}

module.exports = {
  send
}