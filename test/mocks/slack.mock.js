const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('post test-summary to slack', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#36A64F",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Default suite*\n\n*Results*: 4 / 4 Passed (100%)\n*Duration*: 00:02"
                }
              }
            ]
          }
        ]
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
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Regression Tests*\n\n*Results*: 8 / 20 Passed (40%)\n*Duration*: 23:23"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*❌ desktop-chrome*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 03:22"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*❌ mobile-ios*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 09:05"
                }
              }
            ]
          }
        ]
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
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Regression Tests*\n\n*Results*: 8 / 20 Passed (40%)\n*Duration*: 23:23"
                }
              }
            ]
          }
        ]
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
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Regression Tests*\n\n*Results*: 8 / 20 Passed (40%)\n*Duration*: 23:23"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*❌ desktop-chrome*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 03:22"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Test*: GU\n*Error*: expected [A] but found [948474]\n\n*Test*: SBP_WA\n*Error*: Expected condition failed: : 95ddbda01ea4b3dbcb049e681a6...}\n\n*Test*: CB\n*Error*: element click intercepted:\n\n"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*❌ mobile-ios*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 09:05"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Test*: GU\n*Error*: expected [A] but found [948474]\n\n*Test*: SBP_WA\n*Error*: Appium error: An unknown sr='Search...']}\n\n*Test*: CB\n*Error*: A script did not complete \n\n"
                }
              }
            ]
          }
        ]
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
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 00:02"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Test*: c4\n*Error*: expected [true] but found [false]\n\n"
                }
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary with hyperlinks to slack', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#36A64F",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Default suite*\n\n*Results*: 4 / 4 Passed (100%)\n*Duration*: 00:02"
                }
              },
              {
                "type": "context",
                "elements": [
                  {
                    "type": "mrkdwn",
                    "text": "<some-url|Pipeline> ｜ <some-url|Video>"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary to slack with report portal analysis', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 00:02"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Report Portal Analysis*\n\n🔴 PB - 0 ｜ 🟡 AB - 0 ｜ 🔵 SI - 0 ｜ ◯ ND - 0 ｜ *🟠 TI - 4*"
                }
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});