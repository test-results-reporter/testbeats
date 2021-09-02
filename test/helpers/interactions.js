const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('post test-summary to teams', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "type": "message",
        "attachments": [
          {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
              "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
              "type": "AdaptiveCard",
              "version": "1.0",
              "body": [
                {
                  "type": "TextBlock",
                  "text": "Default suite",
                  "size": "medium",
                  "weight": "bolder"
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Results:",
                      "value": "3 / 4 Passed (75%)"
                    },
                    {
                      "title": "Duration:",
                      "value": "00:02"
                    }
                  ]
                },
                {
                  "type": "TextBlock",
                  "text": "[Pipeline](undefined)",
                  "separator": true
                }
              ],
              "actions": []
            }
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});