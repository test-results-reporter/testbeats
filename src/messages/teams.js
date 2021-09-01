const { toColonNotation } = require('colon-notation');
const { getText, getPercentage } = require('../helpers/helper');

function getTestSummaryMessage(testResults, opts) {
  const testResult = testResults[0];
  const adaptive = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [],
    "actions": []
  }
  const title = opts.title ? opts.title : testResult.name;
  adaptive.body.push({
    "type": "TextBlock",
    "text": title,
    "size": "medium",
    "weight": "bolder"
  });
  const facts = [];
  const percentage = getPercentage(testResult.passed, testResult.total);
  facts.push({
    "title": "Results:",
    "value": `${testResult.passed} / ${testResult.total} Passed (${percentage}%)`
  });
  facts.push({
    "title": "Duration:",
    "value": `${toColonNotation(parseInt(testResult.duration))}`
  });
  adaptive.body.push({
    "type": "FactSet",
    "facts": facts
  });
  if (opts.links) {
    const links = [];
    for (const link of opts.links) {
      links.push(`[${link.text}](${getText(link.url)})`);
    }
    adaptive.body.push({
      "type": "TextBlock",
      "text": links.join(' | '),
      "separator": true
    });
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