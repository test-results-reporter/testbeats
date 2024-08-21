const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('targets - teams - functional', () => {

  it('should send test-summary', async () => {
    const id = mock.addInteraction('post test-summary to teams');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/single-suite.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with multiple suites', async () => {
    const id = mock.addInteraction('post test-summary to teams with multiple suites');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/multiple-suites.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary-slim with multiple suites', async () => {
    const id = mock.addInteraction('post test-summary-slim to teams with multiple suites');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "publish": "test-summary-slim"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/multiple-suites.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send failure-details with multiple suites', async () => {
    const id = mock.addInteraction('post failure-details to teams with multiple suites');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "publish": "failure-details"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/multiple-suites.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send failure-details with single suite', async () => {
    const id = mock.addInteraction('post failure-details to teams with single suite');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "publish": "failure-details"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/single-suite-failures.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with full width', async () => {
    const id = mock.addInteraction('post test-summary to teams with full width');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "width": "Full"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/single-suite.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary-slim with verbose duration', async () => {
    const id = mock.addInteraction('post test-summary-slim with verbose duration');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "publish": "test-summary-slim",
              "duration": "verbose"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/multiple-suites.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with title_link', async () => {
    const id = mock.addInteraction('post test-summary to teams with title_link');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "title_link": "some-url"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/single-suite.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with functional condition', async () => {
    const id = mock.addInteraction('post test-summary to teams');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "condition": ({ target, result }) => {
              assert.equal(target.name, 'teams');
              assert.equal(result.name, 'Default suite');
              return true;
            },
            "inputs": {
              "url": "http://localhost:9393/message"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/single-suite.xml"
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

describe('targets - teams - performance', () => {

  it('should send test-summary', async () => {
    const id = mock.addInteraction('post test-summary to teams for JMeter');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "only_failures": false
            }
          }
        ],
        "results": [
          {
            "type": "jmeter",
            "files": [
              "test/data/jmeter/sample.csv"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with thresholds', async () => {
    const id = mock.addInteraction('post test-summary to teams for failed JMeter');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "only_failures": false
            }
          }
        ],
        "results": [
          {
            "type": "jmeter",
            "files": [
              "test/data/jmeter/sample.csv"
            ],
            "thresholds": [
              {
                "metric": "Samples",
                "checks": ["sum>10"]
              },
              {
                "metric": "Duration",
                "checks": ["avg<3500"]
              }
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary-slim', async () => {
    const id = mock.addInteraction('post test-summary-slim to teams for JMeter');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "publish": "test-summary-slim",
              "title": "Performance Test",
              "title_suffix": "Results"
            }
          }
        ],
        "results": [
          {
            "type": "jmeter",
            "files": [
              "test/data/jmeter/sample.csv"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with failures only', async () => {
    const id = mock.addInteraction('post test-summary with failures to teams for failed JMeter');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "only_failures": true
            }
          }
        ],
        "results": [
          {
            "type": "jmeter",
            "files": [
              "test/data/jmeter/sample.csv"
            ],
            "thresholds": [
              {
                "metric": "Samples",
                "checks": ["sum>10"]
              },
              {
                "metric": "Duration",
                "checks": ["avg<3500"]
              }
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with filtered metrics and fields', async () => {
    const id = mock.addInteraction('post test-summary to teams with filtered metrics and fields for JMeter');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message",
              "only_failures": false,
              "metrics": [
                {
                  "name": "Samples",
                  "condition": "fail"
                },
                {
                  "name": "Duration",
                  "condition": "always",
                  "fields": ["avg", "p99"]
                },
                {
                  "name": "Data Sent",
                  "fields": ["rate"]
                }
              ]
            }
          }
        ],
        "results": [
          {
            "type": "jmeter",
            "files": [
              "test/data/jmeter/sample.csv"
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