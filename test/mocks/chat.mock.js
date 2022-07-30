const { addInteractionHandler } = require('pactum').handler;
const { addDataTemplate } = require('pactum').stash;

addDataTemplate({
  'CHAT_RESULT_SINGLE_SUITE': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>✅ Default suite</b><br><br><b>Results</b>: 4 / 4 Passed (100%)<br><b>Duration</b>: 0:02"
        }
      }
    ]
  },
  'CHAT_RESULT_SINGLE_SUITE_FAILURES': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>❌ Default suite</b><br><br><b>Results</b>: 3 / 4 Passed (75%)<br><b>Duration</b>: 0:02"
        }
      }
    ]
  },
  'CHAT_RESULT_MULTIPLE_SUITE_FAILURES': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>Regression Tests</b><br><br><b>Results</b>: 8 / 20 Passed (40%)<br><b>Duration</b>: 23:23"
        }
      }
    ]
  },
  'CHAT_RESULT_MULTIPLE_SUITE_FAILURES_WITH_EMOJI': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>❌ Regression Tests</b><br><br><b>Results</b>: 8 / 20 Passed (40%)<br><b>Duration</b>: 23:23"
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
          "text": "<b>❌ desktop-chrome</b><br><br><b>Results</b>: 2 / 5 Passed (40%)<br><b>Duration</b>: 3:22<br><br><b>❌ mobile-ios</b><br><br><b>Results</b>: 2 / 5 Passed (40%)<br><b>Duration</b>: 9:05"
        }
      }
    ]
  },
  'SUITE_MULTIPLE_SUITE_FAILURE_DETAILS': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>❌ desktop-chrome</b><br><br><b>Results</b>: 2 / 5 Passed (40%)<br><b>Duration</b>: 3:22<br><br><b>Test</b>: GU<br><b>Error</b>: expected [A] but found [948474]<br><br><b>Test</b>: SBP_WA<br><b>Error</b>: Expected condition failed: : 95ddbda01ea4b3dbcb049e681a6...}<br><br><b>Test</b>: CB<br><b>Error</b>: element click intercepted:<br><br><br><br><b>❌ mobile-ios</b><br><br><b>Results</b>: 2 / 5 Passed (40%)<br><b>Duration</b>: 9:05<br><br><b>Test</b>: GU<br><b>Error</b>: expected [A] but found [948474]<br><br><b>Test</b>: SBP_WA<br><b>Error</b>: Appium error: An unknown sr='Search...']}<br><br><b>Test</b>: CB<br><b>Error</b>: A script did not complete <br><br>"
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
                      "text": "<b><a href=\"some-url\">✅ Default suite</a></b><br><br><b>Results</b>: 4 / 4 Passed (100%)<br><b>Duration</b>: 0:02"
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