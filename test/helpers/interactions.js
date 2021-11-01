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

addInteractionHandler('post failure-details to teams with multiple suites', () => {
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
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Test:",
                      "value": "GU"
                    },
                    {
                      "title": "Error:",
                      "value": "expected [A] but found [948474]"
                    }
                  ]
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Test:",
                      "value": "SBP_WA"
                    },
                    {
                      "title": "Error:",
                      "value": "Expected condition failed: : 95ddbda01ea4b3dbcb049e681a6...}"
                    }
                  ]
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Test:",
                      "value": "CB"
                    },
                    {
                      "title": "Error:",
                      "value": "element click intercepted:"
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
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Test:",
                      "value": "GU"
                    },
                    {
                      "title": "Error:",
                      "value": "expected [A] but found [948474]"
                    }
                  ]
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Test:",
                      "value": "SBP_WA"
                    },
                    {
                      "title": "Error:",
                      "value": "Appium error: An unknown sr='Search...']}"
                    }
                  ]
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Test:",
                      "value": "CB"
                    },
                    {
                      "title": "Error:",
                      "value": "A script did not complete "
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

addInteractionHandler('post failure-details to teams with single suite', () => {
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
                  "text": "❌ Default suite",
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
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Test:",
                      "value": "c4"
                    },
                    {
                      "title": "Error:",
                      "value": "expected [true] but found [false]"
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
            "mrkdwn_in": ["text", "fields"],
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
            "mrkdwn_in": ["text", "fields"],
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
            "mrkdwn_in": ["text", "fields"],
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
            "text": "*desktop-chrome*",
            "color": "danger",
            "mrkdwn_in": ["text", "fields"],
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
            "text": "*mobile-ios*",
            "color": "danger",
            "mrkdwn_in": ["text", "fields"],
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

addInteractionHandler('post failure-details to slack with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "mrkdwn_in": [
              "text",
              "fields"
            ],
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
            "text": "*desktop-chrome*",
            "mrkdwn_in": [
              "text",
              "fields"
            ],
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
              },
              {
                "value": "*Test*: GU\n*Error*: expected [A] but found [948474]"
              },
              {
                "value": "*Test*: SBP_WA\n*Error*: Expected condition failed: : 95ddbda01ea4b3dbcb049e681a6...}"
              },
              {
                "value": "*Test*: CB\n*Error*: element click intercepted:"
              }
            ]
          },
          {
            "text": "*mobile-ios*",
            "mrkdwn_in": [
              "text",
              "fields"
            ],
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
              },
              {
                "value": "*Test*: GU\n*Error*: expected [A] but found [948474]"
              },
              {
                "value": "*Test*: SBP_WA\n*Error*: Appium error: An unknown sr='Search...']}"
              },
              {
                "value": "*Test*: CB\n*Error*: A script did not complete "
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

addInteractionHandler('post failure-details to slack with single suite', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "mrkdwn_in": [
              "text",
              "fields"
            ],
            "color": "danger",
            "fields": [
              {
                "title": "Results",
                "value": "3 / 4 Passed (75%)",
                "short": true
              },
              {
                "title": "Duration",
                "value": "00:02",
                "short": true
              },
              {
                "value": "*Test*: c4\n*Error*: expected [true] but found [false]"
              }
            ]
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

addInteractionHandler('post test-summary to teams with retries', () => {
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
                  "text": "❌ Staging - UI Smoke Test Run",
                  "size": "medium",
                  "weight": "bolder"
                },
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Results:",
                      "value": "4 / 6 Passed (67%)"
                    },
                    {
                      "title": "Duration:",
                      "value": "31:23"
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

addInteractionHandler('post test-summary to slack with retries', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "mrkdwn_in": [
              "text",
              "fields"
            ],
            "color": "danger",
            "fields": [
              {
                "title": "Results",
                "value": "4 / 6 Passed (67%)",
                "short": true
              },
              {
                "title": "Duration",
                "value": "31:23",
                "short": true
              }
            ]
          }
        ],
        "text": "*Staging - UI Smoke Test Run*"
      }
    },
    response: {
      status: 200
    }
  }
});