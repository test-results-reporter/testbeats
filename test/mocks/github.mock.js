const { addInteractionHandler } = require('pactum').handler;
const { addDataTemplate } = require('pactum').stash;
const { includes } = require('pactum-matchers');

// addDataTemplate({
//   'GITHUB_SINGLE_SUITE_SUCCESS': {
//     body: includes('✅ Default suite')
//   },
//   'GITHUB_SINGLE_SUITE_FAILURE': {
//     body: includes('❌ Default suite')
//   },
//   'GITHUB_MULTIPLE_SUITES': {
//     body: includes('❌ Regression Tests')
//   },
//   'GITHUB_COMMENT_WITH_TITLE': {
//     body: includes('Test Results Summary')
//   },
//   'GITHUB_FAILURE_DETAILS': {
//     body: includes('<details>')
//   }
// });

addInteractionHandler('post test-summary to github', () => {
  return {
    request: {
      method: 'POST',
      path: '/repos/org/repo/issues/123/comments',
      headers: {
        'Authorization': 'token test-token',
        'Content-Type': 'application/json'
      },
      body: {
        body: includes('✅ Default suite')
      }
    },
    response: {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        id: 123456,
        body: "## Test Results Summary\n\n✅ **1** test passed\n\n**Duration:** 1s",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    }
  };
});

addInteractionHandler('post test-summary to github with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/repos/test-owner/test-repo/issues/123/comments',
      headers: {
        'Authorization': 'token test-token',
        'Content-Type': 'application/json'
      },
      body: {
        body: includes('### mobile-ios')
      }
    },
    response: {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        id: 123456,
        body: "## Test Results Summary\n\n✅ **1** test passed\n\n**Duration:** 1s",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    }
  };
});

addInteractionHandler('post test-summary-slim to github with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/repos/test-owner/test-repo/issues/123/comments',
      headers: {
        'Authorization': 'token test-token',
        'Content-Type': 'application/json'
      },
      body: {
        body: "## ❌ Regression Tests\n\n**Results**: 8 / 20 Passed (40%)\n**Duration**: 23m 23s\n\n"
      }
    },
    response: {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        id: 123456,
        body: "## Test Results Summary\n\n✅ **8** tests passed\n❌ **2** tests failed\n⏭️ **1** test skipped\n\n**Duration:** 5s",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    }
  };
});

addInteractionHandler('post failure-details to github with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/repos/test-owner/test-repo/issues/123/comments',
      headers: {
        'Authorization': 'token test-token',
        'Content-Type': 'application/json'
      },
      body: {
        body: includes('Failed Tests')
      }
    },
    response: {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        id: 123456,
        body: "## Test Failure Details\n\n### Failed Tests\n\n- test 1: assertion error\n- test 2: timeout error",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    }
  };
});

addInteractionHandler('post test-summary to github with title', () => {
  return {
    request: {
      method: 'POST',
      path: '/repos/test-owner/test-repo/issues/123/comments',
      headers: {
        'Authorization': 'token test-token',
        'Content-Type': 'application/json'
      },
      body: {
        body: includes('Custom Title')
      }
    },
    response: {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        id: 123456,
        body: "## Test Results Summary\n\n✅ **1** test passed\n\n**Duration:** 1s",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    }
  };
});

addInteractionHandler('get existing comments for update', () => {
  return {
    request: {
      method: 'GET',
      path: '/repos/test-owner/test-repo/issues/123/comments',
      headers: {
        'Authorization': 'token test-token'
      }
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: [
        {
          id: 123456,
          body: "## Test Results Summary\n\n✅ **1** test passed\n\n**Duration:** 1s",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z"
        }
      ]
    }
  };
});

addInteractionHandler('update existing comment', () => {
  return {
    request: {
      method: 'PATCH',
      path: '/repos/test-owner/test-repo/issues/comments/123456',
      headers: {
        'Authorization': 'token test-token',
        'Content-Type': 'application/json'
      },
      body: {
        body: /## Test Results Summary/
      }
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        id: 123456,
        body: "## Test Results Summary\n\n✅ **1** test passed\n\n**Duration:** 1s",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    }
  };
});

addInteractionHandler('github api error', () => {
  return {
    request: {
      method: 'POST',
      path: '/repos/test-owner/test-repo/issues/123/comments',
      headers: {
        'Authorization': 'token test-token',
        'Content-Type': 'application/json'
      }
    },
    response: {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        message: 'Internal Server Error'
      }
    }
  };
});

addInteractionHandler('post test-summary to github with beats', () => {
  return {
    request: {
      method: 'POST',
      path: '/repos/org/repo/issues/123/comments',
      headers: {
        'Authorization': 'token test-token',
        'Content-Type': 'application/json'
      },
      body: {
        body: includes('[build-name]')
      }
    },
    response: {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  };
});
