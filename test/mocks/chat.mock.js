const { addInteractionHandler } = require('pactum').handler;
const { addDataTemplate } = require('pactum').stash;

addDataTemplate({
  'RESULT_SINGLE_SUITE': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>✅ Default suite</b><br><br><b>Results</b>: 4 / 4 Passed (100%)<br><b>Duration</b>: 0:02"
        }
      }
    ]
  },
  'RESULT_SINGLE_SUITE_FAILURES': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>❌ Default suite</b><br><br><b>Results</b>: 3 / 4 Passed (75%)<br><b>Duration</b>: 0:02"
        }
      }
    ]
  },
  'RESULT_MULTIPLE_SUITE_FAILURES': {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>Regression Tests</b><br><br><b>Results</b>: 8 / 20 Passed (40%)<br><b>Duration</b>: 23:23"
        }
      }
    ]
  },
  'RESULT_MULTIPLE_SUITE_FAILURES_WITH_EMOJI': {
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
                "@DATA:TEMPLATE@": "RESULT_SINGLE_SUITE"
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
                "@DATA:TEMPLATE@": "RESULT_MULTIPLE_SUITE_FAILURES"
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
                "@DATA:TEMPLATE@": "RESULT_MULTIPLE_SUITE_FAILURES_WITH_EMOJI"
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
                "@DATA:TEMPLATE@": "RESULT_MULTIPLE_SUITE_FAILURES"
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
                "@DATA:TEMPLATE@": "RESULT_SINGLE_SUITE_FAILURES"
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