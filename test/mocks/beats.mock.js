const { addInteractionHandler } = require('pactum').handler;
const { like, includes } = require('pactum-matchers');

addInteractionHandler('post test results to beats', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/core/v1/test-runs'
    },
    response: {
      status: 200,
      body: {
        id: 'test-run-id'
      }
    }
  }
});

addInteractionHandler('get test results from beats', () => {
  return {
    strict: false,
    request: {
      method: 'GET',
      path: '/api/core/v1/test-runs/key',
      queryParams: {
        "id": "test-run-id"
      }
    },
    response: {
      status: 200,
      body: {
        id: 'test-run-id',
        "failure_summary_status": "COMPLETED",
        "smart_analysis_status": "COMPLETED",
        "execution_metrics": [
          {
            "failure_summary": "test failure summary"
          }
        ]
      }
    }
  }
});

addInteractionHandler('get test results with smart analysis from beats', () => {
  return {
    strict: false,
    request: {
      method: 'GET',
      path: '/api/core/v1/test-runs/key',
      queryParams: {
        "id": "test-run-id"
      }
    },
    response: {
      status: 200,
      body: {
        id: 'test-run-id',
        "failure_summary_status": "COMPLETED",
        "smart_analysis_status": "SKIPPED",
        "execution_metrics": [
          {
            "failure_summary": "",
            "newly_failed": 1,
            "always_failing": 1,
            "recovered": 1,
            "added": 0,
            "removed": 0,
            "flaky": 1,
          }
        ]
      }
    }
  }
});

addInteractionHandler('get error clusters from beats', () => {
  return {
    strict: false,
    request: {
      method: 'GET',
      path: '/api/core/v1/test-runs/test-run-id/error-clusters',
      queryParams: {
        "limit": 3
      }
    },
    response: {
      status: 200,
      body: {
        values: [
          {
            test_failure_id: 'test-failure-id',
            failure: 'failure two',
            count: 2
          },
          {
            test_failure_id: 'test-failure-id',
            failure: 'failure one',
            count: 1
          }
        ]
      }
    }
  }
});

addInteractionHandler('get empty error clusters from beats', () => {
  return {
    strict: false,
    request: {
      method: 'GET',
      path: '/api/core/v1/test-runs/test-run-id/error-clusters',
      queryParams: {
        "limit": 3
      }
    },
    response: {
      status: 200,
      body: {
        values: []
      }
    }
  }
});

addInteractionHandler('upload attachments', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/core/v1/test-cases/attachments',
    },
    response: {
      status: 200,
    }
  }
})