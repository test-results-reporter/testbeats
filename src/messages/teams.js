const { toColonNotation } = require('colon-notation');
const { getText, getPercentage } = require('../helpers/helper');

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
    links.push(`[${link.text}](${getText(link.url)})`);
  }
  return {
    "type": "TextBlock",
    "text": links.join(' | '),
    "separator": true
  }
}

function getTestSummaryMessage(testResults, opts) {
  const testResult = testResults[0];
  const adaptive = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [],
    "actions": []
  }
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

module.exports = {
  getTestSummaryMessage
}