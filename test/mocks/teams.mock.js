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
                  "text": "Regression Tests",
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
                  "text": "❌ desktop-chrome",
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
                  "text": "❌ mobile-ios",
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
                  "text": "Regression Tests",
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
                  "text": "❌ desktop-chrome",
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
                  "text": "❌ mobile-ios",
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

addInteractionHandler('post test-summary with hyperlinks to teams', () => {
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
                  "text": "[Pipeline](some-url) ｜ [Video](some-url)",
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

addInteractionHandler('post test-summary to teams with report portal analysis', () => {
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
                  "type": "TextBlock",
                  "text": "Report Portal Analysis",
                  "isSubtle": true,
                  "weight": "bolder",
                  "separator": true
                },
                {
                  "type": "TextBlock",
                  "text": "🔴 PB - 0 ｜ 🟡 AB - 0 ｜ 🔵 SI - 0 ｜ ◯ ND - 0 ｜ **🟠 TI - 4**"
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

addInteractionHandler('post test-summary to teams with mentions', () => {
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
                  "type": "TextBlock",
                  "text": "<at>mom</at> ｜ <at>dad</at>",
                  "separator": true
                }
              ],
              "actions": [],
              "msteams": {
                "entities": [
                  {
                    "type": "mention",
                    "text": "<at>mom</at>",
                    "mentioned": {
                      "id": "mom@family",
                      "name": "mom"
                    }
                  },
                  {
                    "type": "mention",
                    "text": "<at>dad</at>",
                    "mentioned": {
                      "id": "dad@family",
                      "name": "dad"
                    }
                  }
                ]
              }
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