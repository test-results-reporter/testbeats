function getTestSummaryMessage(testResults, opts) {
  let total = 0;
  let passed = 0;
  for (const testResult of testResults) {
    total += testResult.total;
    passed += testResult.passed;
  }
  const payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
          "type": "AdaptiveCard",
          "version": "1.0",
          "body": [],
          "actions": []
        }
      }
    ]
  };
  if (opts.title) {
    payload.attachments[0].content.body.push({
      "type": "TextBlock",
      "text": opts.title,
      "size": "large"
    });
  }
  payload.attachments[0].content.body.push({
    "type": "FactSet",
    "facts": [
      {
        "title": "Results",
        "value": `${passed}/${total} Passed`
      }
    ]
  });
  return payload;
}

module.exports = {
  getTestSummaryMessage
}