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

addInteractionHandler('get failure signatures from beats', () => {
  return {
    strict: false,
    request: {
      method: 'GET',
      path: '/api/core/v1/automation/test-run-executions/test-run-id/failure-signatures'
    },
    response: {
      status: 200,
      body: [
        {
          id: 'signature-id-1',
          signature: 'AssertionError: Expected value to be 5 but got 3',
          failure_type: 'AssertionError',
          count: 3
        },
        {
          id: 'signature-id-2',
          signature: 'TimeoutError: Element not found within 5 seconds',
          failure_type: 'TimeoutError',
          count: 2
        }
      ]
    }
  }
});

addInteractionHandler('get empty failure signatures from beats', () => {
  return {
    strict: false,
    request: {
      method: 'GET',
      path: '/api/core/v1/automation/test-run-executions/test-run-id/failure-signatures'
    },
    response: {
      status: 200,
      body: []
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

addInteractionHandler('search projects from beats', () => {
  return {
    strict: false,
    request: {
      method: 'GET',
      path: '/api/core/v1/projects',
    },
    response: {
      status: 200,
      body: {
        values: [
          { id: 'project-id', name: 'test' }
        ]
      }
    }
  }
})

addInteractionHandler('compare manual tests from beats', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/core/v1/manual/sync/compare',
      body: {
        "project_id": "project-id",
        "folders": [
          {
            "name": "empty-folder",
            "hash": "1e9b0f6accf2965dbbd771ad333ce438",
            "test_suites": [],
            "folders": [
              {
                "name": "another-empty",
                "hash": "d713e214708f1ed91f2767f8a7284d11",
                "test_suites": [],
                "folders": []
              }
            ]
          },
          {
            "name": "mixed-content",
            "hash": "23c8ab386c3a7f0aac9ee63495b88357",
            "test_suites": [
              {
                "name": "Mixed Content Feature",
                "hash": "ea383564b91d94cc10768d6ad40a4609"
              }
            ],
            "folders": [
              {
                "name": "sub-folder",
                "hash": "6016008b3fc77753badd6f01bd0ab0e7",
                "test_suites": [
                  {
                    "name": "Sub Folder Feature",
                    "hash": "53c92cd0b689d4effc64e7941e477620"
                  }
                ],
                "folders": []
              }
            ]
          },
          {
            "name": "nested-folder",
            "hash": "b004698184622eacd0b743e4579bbfee",
            "test_suites": [
              {
                "name": "Nested Feature",
                "hash": "829dca50957eb606804be4dc600dbf75"
              }
            ],
            "folders": [
              {
                "name": "deep-nested",
                "hash": "65f358ba802847e4e48980264fcdfcb5",
                "test_suites": [
                  {
                    "name": "Deep Nested Feature",
                    "hash": "0b02a5db2c91819d8d4bd25f55d5f233"
                  }
                ],
                "folders": [
                  {
                    "name": "very-deep",
                    "hash": "6d746bfe67a201001247aef893acf674",
                    "test_suites": [
                      {
                        "name": "Very Deep Nested Feature",
                        "hash": "95d3b5476856946e1ffb05f0202c1d51"
                      }
                    ],
                    "folders": []
                  }
                ]
              }
            ]
          },
          {
            "name": "no-features-folder",
            "hash": "f1e669db54e5d0e346a9baa4f4779010",
            "test_suites": [],
            "folders": [
              {
                "name": "empty-sub",
                "hash": "ec16a5e4cae589a2fc67e5c87c0dbd91",
                "test_suites": [],
                "folders": []
              }
            ]
          },
          {
            "name": "default",
            "hash": "ced8f39246b0e98795b3776414c57948",
            "test_suites": [
              {
                "name": "Background Section Examples",
                "hash": "5956a1536ab910dd6475149909ea599c"
              },
              {
                "name": "Basic Calculator Operations",
                "hash": "94d205787166e1f9943830e78809a4a2"
              },
              {
                "name": "Comment Examples in Gherkin",
                "hash": "cfc4f70cdf2b8b423415e3f97ca4e438"
              },
              {
                "name": "User Management System",
                "hash": "aab95661bb75f43ebc1e112a246bd212"
              },
              {
                "name": "Main Feature",
                "hash": "bb879c3cf8d3d1a291c7e1e0eb4e54bd"
              },
              {
                "name": "No Steps",
                "hash": "545227151a54de1bd35ffb7b0953de90"
              },
              {
                "name": "No Tags",
                "hash": "4e6541a588f195f52aa2a6a7aa31888c"
              }
            ],
            "folders": []
          }
        ]
      }
    },
    response: {
      status: 200,
      body: {
        folders: [
          {
            type: 'create',
            name: 'empty-folder',
            hash: '1e9b0f6accf2965dbbd771ad333ce438',
            test_suites: [],
            folders: []
          }
        ]
      }
    }
  }
})

addInteractionHandler('sync manual folders to beats', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/core/v1/manual/sync/folders',
    },
    response: {
      status: 200,
      body: {
        results: [
          { success: true, name: 'test', id: 'test-folder-id' }
        ]
      }
    }
  }
});

addInteractionHandler('post test results to beats with metadata', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/core/v1/test-runs',
      body: {
        metadata: {
          environment: 'production',
          browser: 'chrome',
          region: 'us-east-1'
        }
      }
    },
    response: {
      status: 200,
      body: {
        id: 'test-run-id'
      }
    }
  }
});