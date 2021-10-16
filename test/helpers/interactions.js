const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('post test-summary to teams with single suite', () => {
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
                  "text": "✅ Default suite",
                  "size": "medium",
                  "weight": "bolder"
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Results:",
                      "value": "4 / 4 Passed (100%)"
                    },
                    {
                      "title": "Duration:",
                      "value": "00:02"
                    }
                  ]
                },
                {
                  "type": "TextBlock",
                  "text": "[Pipeline](some-url)",
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

addInteractionHandler('post test-summary to teams with multiple suites', () => {
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
                  "text": "❌ Regression Tests",
                  "size": "medium",
                  "weight": "bolder"
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Results:",
                      "value": "8 / 20 Passed (40%)"
                    },
                    {
                      "title": "Duration:",
                      "value": "23:23"
                    }
                  ]
                },
                {
                  "type": "TextBlock",
                  "text": "desktop-chrome",
                  "isSubtle": true,
                  "weight": "bolder"
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Results:",
                      "value": "2 / 5 Passed (40%)"
                    },
                    {
                      "title": "Duration:",
                      "value": "03:22"
                    }
                  ]
                },
                {
                  "type": "TextBlock",
                  "text": "mobile-ios",
                  "isSubtle": true,
                  "weight": "bolder"
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Results:",
                      "value": "2 / 5 Passed (40%)"
                    },
                    {
                      "title": "Duration:",
                      "value": "09:05"
                    }
                  ]
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

addInteractionHandler('post test-summary-slim to teams with multiple suites', () => {
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
                  "text": "❌ Regression Tests",
                  "size": "medium",
                  "weight": "bolder"
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Results:",
                      "value": "8 / 20 Passed (40%)"
                    },
                    {
                      "title": "Duration:",
                      "value": "23:23"
                    }
                  ]
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

addInteractionHandler('post test-summary to slack with single suite', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "good",
            "fields": [
              {
                "title": "Results",
                "value": "4 / 4 Passed (100%)",
                "short": true
              },
              {
                "title": "Duration",
                "value": "00:02",
                "short": true
              }
            ]
          },
          {
            "fallback": "links",
            "footer": "<some-url|Pipeline>"
          }
        ],
        "text": "*Default suite*"
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary-slim to slack with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "danger",
            "fields": [
              {
                "title": "Results",
                "value": "8 / 20 Passed (40%)",
                "short": true
              },
              {
                "title": "Duration",
                "value": "23:23",
                "short": true
              }
            ]
          }
        ],
        "text": "*Regression Tests*"
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary to slack with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "danger",
            "fields": [
              {
                "title": "Results",
                "value": "8 / 20 Passed (40%)",
                "short": true
              },
              {
                "title": "Duration",
                "value": "23:23",
                "short": true
              }
            ]
          },
          {
            "text": "desktop-chrome",
            "color": "danger",
            "fields": [
              {
                "title": "Results",
                "value": "2 / 5 Passed (40%)",
                "short": true
              },
              {
                "title": "Duration",
                "value": "03:22",
                "short": true
              }
            ]
          },
          {
            "text": "mobile-ios",
            "color": "danger",
            "fields": [
              {
                "title": "Results",
                "value": "2 / 5 Passed (40%)",
                "short": true
              },
              {
                "title": "Duration",
                "value": "09:05",
                "short": true
              }
            ]
          }
        ],
        "text": "*Regression Tests*"
      }
    },
    response: {
      status: 200
    }
  }
});