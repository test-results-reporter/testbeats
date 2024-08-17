const { addInteractionHandler } = require('pactum').handler;
const { addDataTemplate } = require('pactum').stash;
const { includes } = require('pactum-matchers');

addDataTemplate({
  'SLACK_ROOT_SINGLE_SUITE': {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Default suite*\n\n*Results*: 4 / 4 Passed (100%)\n*Duration*: 2s"
    }
  },
  'SLACK_ROOT_SINGLE_SUITE_FAILURE': {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 2s"
    }
  },
  'SLACK_ROOT_MULTIPLE_SUITES': {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Regression Tests*\n\n*Results*: 8 / 20 Passed (40%)\n*Duration*: 23m 23s"
    }
  },
  'SLACK_SUITE_CHROME': {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*❌ desktop-chrome*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 3m 22s"
    }
  },
  'SLACK_SUITE_IOS': {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*❌ mobile-ios*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 9m 5s"
    }
  }
});

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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE"
              }
            ],
            "fallback": "Default suite\nResults: 4 / 4 Passed (100%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_MULTIPLE_SUITES"
              },
              {
                "@DATA:TEMPLATE@": "SLACK_SUITE_CHROME"
              },
              {
                "@DATA:TEMPLATE@": "SLACK_SUITE_IOS"
              }
            ],
            "fallback": "Regression Tests\nResults: 8 / 20 Passed (40%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_MULTIPLE_SUITES"
              }
            ],
            "fallback": "Regression Tests\nResults: 8 / 20 Passed (40%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_MULTIPLE_SUITES"
              },
              {
                "@DATA:TEMPLATE@": "SLACK_SUITE_CHROME"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Test*: GU\n*Error*: expected [A] but found [948474]\n\n*Test*: SBP_WA\n*Error*: Expected condition failed: : 95ddbda01ea4b3dbcb049e681a6...}\n\n*Test*: CB\n*Error*: element click intercepted:\n\n"
                }
              },
              {
                "@DATA:TEMPLATE@": "SLACK_SUITE_IOS"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Test*: GU\n*Error*: expected [A] but found [948474]\n\n*Test*: SBP_WA\n*Error*: Appium error: An unknown sr='Search...']}\n\n*Test*: CB\n*Error*: A script did not complete \n\n"
                }
              }
            ],
            "fallback": "Regression Tests\nResults: 8 / 20 Passed (40%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Test*: c4\n*Error*: expected [true] but found [false]\n\n"
                }
              }
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE"
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
            ],
            "fallback": "Default suite\nResults: 4 / 4 Passed (100%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
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
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*<http://localhost:9393/ui/#project-name/launches/all/uuid|Report Portal Analysis>*\n\n🔴 PB - 0 ｜ 🟡 AB - 0 ｜ 🔵 SI - 0 ｜ ◯ ND - 0 ｜ *🟠 TI - 4*"
                }
              }
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*<http://localhost:9393|Report Portal Analysis>*\n\n🔴 PB - 0 ｜ 🟡 AB - 0 ｜ 🔵 SI - 0 ｜ ◯ ND - 0 ｜ *🟠 TI - 4*"
                }
              }
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
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
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "<@ULA15K66M> ｜ <@ULA15K66N>"
                }
              }
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary with mentions group name to slack', () => {
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "<!subteam^ULA15K66M>"
                }
              }
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary with mentions special group name to slack', () => {
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "<!here>"
                }
              }
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE",
                "@OVERRIDES@": {
                  "accessory": {
                    "type": "image",
                    "image_url": `${ctx.data.quickChartUrl}/chart?c=%7B%22type%22%3A%22radialGauge%22%2C%22data%22%3A%7B%22datasets%22%3A%5B%7B%22data%22%3A%5B75%5D%2C%22backgroundColor%22%3A%22green%22%7D%5D%7D%2C%22options%22%3A%7B%22trackColor%22%3A%22%23FF0000%22%2C%22roundedCorners%22%3Afalse%2C%22centerPercentage%22%3A80%2C%22centerArea%22%3A%7B%22fontSize%22%3A74%2C%22text%22%3A%2275%25%22%7D%7D%7D`,
                    "alt_text": "overall-results-summary"
                  }
                }
              }
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Last 3 Runs*\n\n<http://localhost:9393/ui/#project-name/launches/all/uuid|❌> <http://localhost:9393/ui/#project-name/launches/all/uuid|✅> <http://localhost:9393/ui/#project-name/launches/all/uuid|⚠️>"
                }
              }
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE_FAILURE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*<https://percy.io/org-uid/project-name/builds/build-id|Percy Analysis>*\n\n*✔ AP - 1* ｜ 🔎 UR - 0 ｜ 🗑 RM - 0"
                }
              }
            ],
            "fallback": "Default suite\nResults: 3 / 4 Passed (75%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary to slack with title_link', () => {
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
                  "text": "*<some-url|Default suite>*\n\n*Results*: 4 / 4 Passed (100%)\n*Duration*: 2s"
                }
              }
            ],
            "fallback": "Default suite\nResults: 4 / 4 Passed (100%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary to slack for JMeter', () => {
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
                  "text": "*TOTAL*\n\n*Results*: 2 / 2 Passed (100%)\n*Samples*: 39 0.55535/s\n*Duration*: avg=4.6s ｜ p95=11.4s"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*S01_T01_Application_Launch*\n\n*Samples*: 10 0.14422/s\n*Duration*: avg=3s ｜ p95=3.7s"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*S01_T02_Application_Login*\n\n*Samples*: 9 0.1461/s\n*Duration*: avg=4.3s ｜ p95=10.7s"
                }
              }
            ],
            "fallback": "TOTAL\nResults: 2 / 2 Passed (100%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary with failures to slack for failed JMeter', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#ECB22E",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*TOTAL 1.2.3*\n\n*Results*: 1 / 2 Passed (50%)\n*Samples*: 39 0.55535/s\n*Duration*: 🔺 avg=4.6s (+1.1s) ｜ p95=11.4s"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*S01_T02_Application_Login 1.2.3*\n\n*Samples*: 🔻 9 (-1) 0.1461/s\n*Duration*: 🔺 avg=4.3s (+855ms) ｜ p95=10.7s"
                }
              }
            ],
            "fallback": "TOTAL 1.2.3\nResults: 1 / 2 Passed (50%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary with metadata to slack', () => {
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Browser:* Chrome ｜ 1920*1080 ｜ <some-url|Pipeline>"
                }
              }
            ],
            "fallback": "Default suite\nResults: 4 / 4 Passed (100%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary with ci-info to slack', () => {
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_SINGLE_SUITE"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Repository:* <https://github.com/test/test|test/test> ｜ *Pull Request:* <https://github.com/test/test/pull/123/merge|123>\n*Build:* <https://dev.azure.com/test/_build/results?buildId=id-123|Build #number-123>"
                }
              }
            ],
            "fallback": "Default suite\nResults: 4 / 4 Passed (100%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary with multiple suites and ci-info to to slack', () => {
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_MULTIPLE_SUITES"
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Repository:* <https://github.com/test/test|test/test> ｜ *Pull Request:* <https://github.com/test/test/pull/123/merge|123>\n*Build:* <https://dev.azure.com/test/_build/results?buildId=id-123|Build #number-123>"
                }
              },
              {
                "@DATA:TEMPLATE@": "SLACK_SUITE_CHROME"
              },
              {
                "@DATA:TEMPLATE@": "SLACK_SUITE_IOS"
              }
            ],
            "fallback": "Regression Tests\nResults: 8 / 20 Passed (40%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary to slack with max suites as 1', () => {
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
                "@DATA:TEMPLATE@": "SLACK_ROOT_MULTIPLE_SUITES"
              },
              {
                "@DATA:TEMPLATE@": "SLACK_SUITE_CHROME"
              }
            ],
            "fallback": "Regression Tests\nResults: 8 / 20 Passed (40%)"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post errors to slack', () => {
  return {
    strict: false,
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
                  "text": "Error: Reporting Test Results"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": includes('invalid.xml')
                }
              }
            ],
            "fallback": "Error: Reporting Test Results"
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});