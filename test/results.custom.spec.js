const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('results - custom - functional', () => {

  it('should send test-summary', async () => {
    const id = mock.addInteraction('post test-summary to slack');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "slack",
                "inputs": {
                  "url": "http://localhost:9393/message"
                }
              }
            ],
            "results": [
              {
                "type": "custom",
                "result": {
                  id: '',
                  name: 'Default suite',
                  total: 4,
                  passed: 4,
                  failed: 0,
                  errors: 0,
                  skipped: 0,
                  retried: 0,
                  duration: 2000,
                  status: 'PASS',
                  suites: [
                    {
                      id: '',
                      name: 'Default test',
                      total: 4,
                      passed: 4,
                      failed: 0,
                      errors: 0,
                      skipped: 0,
                      duration: 2000,
                      status: 'PASS',
                      cases: [
                        {
                          id: '',
                          name: 'c2',
                          total: 0,
                          passed: 0,
                          failed: 0,
                          errors: 0,
                          skipped: 0,
                          duration: 0,
                          status: 'PASS',
                          failure: '',
                          stack_trace: '',
                          steps: []
                        },
                        {
                          id: '',
                          name: 'c3',
                          total: 0,
                          passed: 0,
                          failed: 0,
                          errors: 0,
                          skipped: 0,
                          duration: 10,
                          status: 'PASS',
                          failure: '',
                          stack_trace: '',
                          steps: []
                        },
                        {
                          id: '',
                          name: 'c1',
                          total: 0,
                          passed: 0,
                          failed: 0,
                          errors: 0,
                          skipped: 0,
                          duration: 0,
                          status: 'PASS',
                          failure: '',
                          stack_trace: '',
                          steps: []
                        },
                        {
                          id: '',
                          name: 'c4',
                          total: 0,
                          passed: 0,
                          failed: 0,
                          errors: 0,
                          skipped: 0,
                          duration: 0,
                          status: 'PASS',
                          failure: 'expected [true] but found [false]',
                          stack_trace: '',
                          steps: []
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});