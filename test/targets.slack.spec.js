const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('targets - slack - functional', () => {

  it('should send test-summary', async () => {
    const id = mock.addInteraction('post test-summary to slack');
    await publish({
      config: {
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
    const id = mock.addInteraction('post test-summary to slack with multiple suites');
    await publish({
      config: {
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
    const id = mock.addInteraction('post test-summary-slim to slack with multiple suites');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
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
    const id = mock.addInteraction('post failure-details to slack with multiple suites');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
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
    const id = mock.addInteraction('post failure-details to slack with single suite');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
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

  it('should send test-summary with title_link', async () => {
    const id = mock.addInteraction('post test-summary to slack with title_link');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
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

  it('should send test-summary using max_suites as 1', async () => {
    const id = mock.addInteraction('post test-summary to slack with max suites as 1');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
            "inputs": {
              "url": "http://localhost:9393/message",
              "max_suites": 1
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

  it('should send with suite metadata', async () => {
    const id = mock.addInteraction('post test-summary to slack with suite metadata');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
            "inputs": {
              "url": "http://localhost:9393/message",
              "title": "Cucumber Test Result",
              "only_failures": false
            }
          }
        ],
        "results": [
          {
            "type": "cucumber",
            "files": [
              "test/data/cucumber/suites-with-metadata.json"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary in the blocks format', async () => {
    const id = mock.addInteraction('post test-summary to slack in the blocks format');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
            "inputs": {
              "url": "http://localhost:9393/message",
              "message_format": "blocks"
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

describe('targets - slack - performance', () => {

  it('should send test-summary', async () => {
    const id = mock.addInteraction('post test-summary to slack for JMeter');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
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

  it('should send test-summary with failures only', async () => {
    const id = mock.addInteraction('post test-summary with failures to slack for failed JMeter');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
            "inputs": {
              "url": "http://localhost:9393/message",
              "title_suffix": "1.2.3",
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

  afterEach(() => {
    mock.clearInteractions();
  });

});

describe('targets - slack - token', () => {
  it('should throw error if channels are not defined', async () => {
    let error;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "slack",
              "inputs": {
                "token": "<token>"
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
    } catch (e) {
      error = e;
    }
    assert.equal(error.message, 'channels in slack target inputs must be an array');
  });

  it('should throw error if channels is not an array', async () => {
    let error;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "slack",
              "inputs": {
                "token": "<token>",
                "channels": "some-channel"
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
    } catch (e) {
      error = e;
    }
    assert.equal(error.message, 'channels in slack target inputs must be an array');
  });

  it('should throw error if channels is an empty array', async () => {
    let error;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "slack",
              "inputs": {
                "token": "<token>",
                "channels": []
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
    } catch (e) {
      error = e;
    }
    assert.equal(error.message, 'at least one channel must be defined in slack target inputs');
  });

  it('should send test-summary to multiple channels', async () => {
    const id = mock.addInteraction('post test-summary to slack with channel');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
            "inputs": {
              "url": "http://localhost:9393/message",
              "token": "<token>",
              "channels": ["#tests"]
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


});
