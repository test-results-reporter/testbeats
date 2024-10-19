const { addInteractionHandler } = require('pactum').handler;

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
      path: '/api/core/v1/test-runs/test-run-id',
    },
    response: {
      status: 200,
      body: {
        id: 'test-run-id',
        "failure_summary_status": "COMPLETED",
        "failure_analysis_status": "COMPLETED",
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
      path: '/api/core/v1/test-runs/test-run-id'
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

addInteractionHandler('get test results with failure analysis from beats', () => {
  return {
    strict: false,
    request: {
      method: 'GET',
      path: '/api/core/v1/test-runs/test-run-id'
    },
    response: {
      status: 200,
      body: {
        id: 'test-run-id',
        "failure_summary_status": "COMPLETED",
        "failure_analysis_status": "COMPLETED",
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
            "product_bugs": 1,
            "environment_issues": 1,
            "automation_bugs": 1,
            "not_a_defects": 1,
            "to_investigate": 1,
            "auto_analysed": 1
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

addInteractionHandler('get failure analysis from beats', () => {
  return {
    strict: false,
    request: {
      method: 'GET',
      path: '/api/core/v1/test-runs/test-run-id/failure-analysis'
    },
    response: {
      status: 200,
      body: [
        {
          name: 'To Investigate',
          count: 1
        },
        {
          name: 'Auto Analysed',
          count: 1
        }
      ]
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