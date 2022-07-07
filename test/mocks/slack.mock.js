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
                  "text": "*Default suite*\n\n*Results*: 4 / 4 Passed (100%)\n*Duration*: 0:02"
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
                  "text": "*❌ desktop-chrome*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 3:22"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*❌ mobile-ios*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 9:05"
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
                  "text": "*❌ desktop-chrome*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 3:22"
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
                  "text": "*❌ mobile-ios*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 9:05"
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
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 0:02"
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

addInteractionHandler('post test-summary with hyperlinks to slack - pass status', () => {
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
                  "text": "*Default suite*\n\n*Results*: 4 / 4 Passed (100%)\n*Duration*: 0:02"
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

addInteractionHandler('post test-summary with hyperlinks to slack - fail status', () => {
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
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 0:02"
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
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 0:02"
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

addInteractionHandler('post test-summary to slack with report portal analysis with title_link', () => {
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
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 0:02"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*<http://localhost:9393|Report Portal Analysis>*\n\n🔴 PB - 0 ｜ 🟡 AB - 0 ｜ 🔵 SI - 0 ｜ ◯ ND - 0 ｜ *🟠 TI - 4*"
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

addInteractionHandler('post test-summary to slack with report portal analysis with separator and without title', () => {
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
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 0:02"
                }
              },
              {
                "type": "divider"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "🔴 PB - 0 ｜ 🟡 AB - 0 ｜ 🔵 SI - 0 ｜ ◯ ND - 0 ｜ *🟠 TI - 4*"
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

addInteractionHandler('post test-summary with mentions to slack', () => {
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
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 0:02"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "<@ULA15K66M> ｜ <@ULA15K66N>"
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

addInteractionHandler('post test-summary to slack with qc-test-summary', (ctx) => {
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
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 0:02"
                },
                "accessory": {
                  "type": "image",
                  "image_url": `${ctx.data.quickChartUrl}/chart?c=%7B%22type%22%3A%22radialGauge%22%2C%22data%22%3A%7B%22datasets%22%3A%5B%7B%22data%22%3A%5B75%5D%2C%22backgroundColor%22%3A%22green%22%7D%5D%7D%2C%22options%22%3A%7B%22trackColor%22%3A%22%23FF0000%22%2C%22roundedCorners%22%3Afalse%2C%22centerPercentage%22%3A80%2C%22centerArea%22%3A%7B%22fontSize%22%3A80%2C%22text%22%3A%2275%25%22%7D%7D%7D`,
                  "alt_text": "overall-results-summary"
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

addInteractionHandler('post test-summary to slack with report portal history', () => {
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
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 0:02"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Last 3 Runs*\n\n❌ ✅ ⚠️"
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

addInteractionHandler('post test-summary to slack with percy analysis', () => {
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
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 0:02"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*<https://percy.io/org-uid/project-name/builds/build-id|Percy Analysis>*\n\n*✔ AP - 1* ｜ 🔎 UR - 0 ｜ 🗑 RM - 0"
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