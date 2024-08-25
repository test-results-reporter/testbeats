const { addInteractionHandler } = require('pactum').handler;
const { addDataTemplate } = require('pactum').stash;
const { includes } = require('pactum-matchers');

addDataTemplate({
  'CHAT_RESULT_SINGLE_SUITE': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>✅ Default suite</b><br><br><b>Results</b>: 4 / 4 Passed (100%)<br><b>Duration</b>: 2s"
        }
      }
    ]
  },
  'CHAT_RESULT_SINGLE_SUITE_FAILURES': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>❌ Default suite</b><br><br><b>Results</b>: 3 / 4 Passed (75%)<br><b>Duration</b>: 2s"
        }
      }
    ]
  },
  'CHAT_RESULT_MULTIPLE_SUITE_FAILURES': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>Regression Tests</b><br><br><b>Results</b>: 8 / 20 Passed (40%)<br><b>Duration</b>: 23m 23s"
        }
      }
    ]
  },
  'CHAT_RESULT_MULTIPLE_SUITE_FAILURES_WITH_EMOJI': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>❌ Regression Tests</b><br><br><b>Results</b>: 8 / 20 Passed (40%)<br><b>Duration</b>: 23m 23s"
        }
      }
    ]
  }
});

addDataTemplate({
  'SUITE_MULTIPLE_SUITE_FAILURES': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>❌ desktop-chrome</b><br><br><b>Results</b>: 2 / 5 Passed (40%)<br><b>Duration</b>: 3m 22s<br><br><b>❌ mobile-ios</b><br><br><b>Results</b>: 2 / 5 Passed (40%)<br><b>Duration</b>: 9m 5s"
        }
      }
    ]
  },
  'SUITE_MULTIPLE_SUITE_FAILURE_DETAILS': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>❌ desktop-chrome</b><br><br><b>Results</b>: 2 / 5 Passed (40%)<br><b>Duration</b>: 3m 22s<br><br><b>Test</b>: GU<br><b>Error</b>: expected [A] but found [948474]<br><br><b>Test</b>: SBP_WA<br><b>Error</b>: Expected condition failed: : 95ddbda01ea4b3dbcb049e681a6...}<br><br><b>Test</b>: CB<br><b>Error</b>: element click intercepted:<br><br><br><br><b>❌ mobile-ios</b><br><br><b>Results</b>: 2 / 5 Passed (40%)<br><b>Duration</b>: 9m 5s<br><br><b>Test</b>: GU<br><b>Error</b>: expected [A] but found [948474]<br><br><b>Test</b>: SBP_WA<br><b>Error</b>: Appium error: An unknown sr='Search...']}<br><br><b>Test</b>: CB<br><b>Error</b>: A script did not complete <br><br>"
        }
      }
    ]
  }
});

addDataTemplate({
  'SINGLE_SUITE_FAILURE_DETAILS': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>Test</b>: c4<br><b>Error</b>: expected [true] but found [false]<br><br>"
        }
      }
    ]
  }
});

addInteractionHandler('post test-summary to chat', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE"
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

addInteractionHandler('post test-summary to chat with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_MULTIPLE_SUITE_FAILURES"
              },
              {
                "@DATA:TEMPLATE@": "SUITE_MULTIPLE_SUITE_FAILURES"
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

addInteractionHandler('post test-summary-slim to chat with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_MULTIPLE_SUITE_FAILURES_WITH_EMOJI"
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

addInteractionHandler('post failure-details to chat with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_MULTIPLE_SUITE_FAILURES"
              },
              {
                "@DATA:TEMPLATE@": "SUITE_MULTIPLE_SUITE_FAILURE_DETAILS"
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

addInteractionHandler('post failure-details to chat with single suite', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE_FAILURES"
              },
              {
                "@DATA:TEMPLATE@": "SINGLE_SUITE_FAILURE_DETAILS"
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

addInteractionHandler('post test-summary with hyperlinks to chat', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE"
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<a href=\"some-url\">Pipeline</a> ｜ <a href=\"some-url\">Video</a>"
                    }
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

addInteractionHandler('post test-summary to chat with mentions', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "text": "<users/12345> ｜ <users/67890>",
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE_FAILURES"
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

addInteractionHandler('post test-summary to chat with report portal analysis', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE_FAILURES"
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b><a href=\"http://localhost:9393/ui/#project-name/launches/all/uuid\">Report Portal Analysis</a></b><br><br>🔴 PB - 0 ｜ 🟡 AB - 0 ｜ 🔵 SI - 0 ｜ ◯ ND - 0 ｜ <b>🟠 TI - 4</b>"
                    }
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

addInteractionHandler('post test-summary to chat with report portal history', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE_FAILURES"
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b>Last 3 Runs</b><br><br><a href=\"http://localhost:9393/ui/#project-name/launches/all/uuid\">❌</a> <a href=\"http://localhost:9393/ui/#project-name/launches/all/uuid\">✅</a> <a href=\"http://localhost:9393/ui/#project-name/launches/all/uuid\">⚠️</a>"
                    }
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

addInteractionHandler('post test-summary to chat with percy analysis', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE_FAILURES"
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b><a href=\"https://percy.io/org-uid/project-name/builds/build-id\">Percy Analysis</a></b><br><br><b>✔ AP - 1</b> ｜ 🔎 UR - 0 ｜ 🗑 RM - 0"
                    }
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

addInteractionHandler('post percy analysis with removed snapshots to chat', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE_FAILURES"
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b><a href=\"https://percy.io/org-uid/project-name/builds/build-id\">Percy Analysis</a></b><br><br><b>✔ AP - 1</b> ｜ 🔎 UR - 0 ｜ <b>🗑 RM - 2</b>"
                    }
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

addInteractionHandler('post percy analysis with un-reviewed snapshots to chat', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE_FAILURES"
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b><a href=\"https://percy.io/org-uid/project-name/builds/build-id\">Percy Analysis</a></b><br><br>✔ AP - 0 ｜ <b>🔎 UR - 1</b> ｜ <b>🗑 RM - 2</b>"
                    }
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

addInteractionHandler('post test-summary to chat with title_link', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b><a href=\"some-url\">✅ Default suite</a></b><br><br><b>Results</b>: 4 / 4 Passed (100%)<br><b>Duration</b>: 2s"
                    }
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

addInteractionHandler('post test-summary to chat for JMeter', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b>TOTAL</b><br><br><b>Results</b>: undefined / undefined Passed (0%)<br><br><b>Samples</b>: 39 0.55535/s<br><b>Duration</b>: avg=4.6s ｜ p95=11.4s"
                    }
                  }
                ]
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b>✅ S01_T01_Application_Launch</b><br><br><b>Samples</b>: 10 0.14422/s<br><b>Duration</b>: avg=3s ｜ p95=3.7s<br><br><b>✅ S01_T02_Application_Login</b><br><br><b>Samples</b>: 9 0.1461/s<br><b>Duration</b>: avg=4.3s ｜ p95=10.7s"
                    }
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

addInteractionHandler('post test-summary with failures to chat for failed JMeter', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b>TOTAL 1.2.3</b><br><br><b>Results</b>: undefined / undefined Passed (0%)<br><br><b>Samples</b>: 39 0.55535/s<br><b>Duration</b>: 🔺 avg=4.6s (+1.1s) ｜ p95=11.4s"
                    }
                  }
                ]
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b>❌ S01_T02_Application_Login</b><br><br><b>Samples</b>: 🔻 9 (-1) 0.1461/s<br><b>Duration</b>: 🔺 avg=4.3s (+855ms) ｜ p95=10.7s"
                    }
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

addInteractionHandler('post test-summary with metadata to chat', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE"
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b>Browser:</b> Chrome ｜ 1920*1080 ｜ <a href=\"some-url\">Pipeline</a>"
                    }
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

addInteractionHandler('post test-summary with ci-info to chat', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "@DATA:TEMPLATE@": "CHAT_RESULT_SINGLE_SUITE"
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b>Repository:</b> <a href=\"https://github.com/org/repo\">org/repo</a> ｜ <b>Branch:</b> <a href=\"https://github.com/org/repo/tree/feature-test\">feature-test</a><br><b>Build:</b> <a href=\"https://github.com/org/repo/actions/runs/id-123\">Build #number-123</a> ｜ <a href=\"LOGS_URL\">Download Logs</a>"
                    }
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

addInteractionHandler('post test-summary with suite metadata to chat', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b>Cucumber Test Result</b><br><br><b>Results</b>: 2 / 2 Passed (100%)<br><b>Duration</b>: 3ms"
                    }
                  }
                ]
              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "<b>✅ Addition</b><br><br><b>Results</b>: 1 / 1 Passed (100%)<br><b>Duration</b>: 1ms<br><br>Windows 11 • firefox 129.0<br><br><b>✅ Addition</b><br><br><b>Results</b>: 1 / 1 Passed (100%)<br><b>Duration</b>: 1ms<br><br>Windows 11 • chrome 129.0"
                    }
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

addInteractionHandler('post errors to chat', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "cards": [
          {
            "sections": [
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": includes('invalid.xml')
                    }
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