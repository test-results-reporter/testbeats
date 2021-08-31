function getTestSummaryMessage(testResults, opts) {
  let total = 0;
  let passed = 0;
  let failed = 0;
  let errors = 0;
  for (const testResult in testResults) {
    total += testResult.total;
    passed += testResult.passed;
    failed += testResult.failed;
    errors += testResult.errors;
  }
  const payload = {
    "type": "message",
    "text": "Test Summary",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {
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