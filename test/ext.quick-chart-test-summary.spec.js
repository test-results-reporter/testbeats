const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - quick-chart-test-summary', () => {

  it('should send test-summary with links to teams', async () => {
    const id = mock.addInteraction('post test-summary to teams with qc-test-summary', { quickChartUrl: "https://quickchart.io" });
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message"
            },
            "extensions": [
              {
                "name": "quick-chart-test-summary"
              }
            ]
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

  it('should send test-summary with links to slack', async () => {
    const id = mock.addInteraction('post test-summary to slack with qc-test-summary', { quickChartUrl: "https://quickchart.io" });
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
            "inputs": {
              "url": "http://localhost:9393/message"
            },
            "extensions": [
              {
                "name": "quick-chart-test-summary"
              }
            ]
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

  it('should send test-summary with links to teams with custom qc-test server', async () => {
    const id = mock.addInteraction('post test-summary to teams with qc-test-summary', { quickChartUrl: "https://demo.quickchart.example.com" });
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message"
            },
            "extensions": [
              {
                "name": "quick-chart-test-summary",
                "inputs": {
                  "url": "https://demo.quickchart.example.com"
                }
              }
            ]
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

  it('should send test-summary with links to slack with custom qc-test server', async () => {
    const id = mock.addInteraction('post test-summary to slack with qc-test-summary', { quickChartUrl: "https://demo.quickchart.example.com" });
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
            "inputs": {
              "url": "http://localhost:9393/message"
            },
            "extensions": [
              {
                "name": "quick-chart-test-summary",
                "inputs": {
                  "url": "https://demo.quickchart.example.com"
                }
              }
            ]
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

  it('should send test-summary with links to teams and default qc-test server if url empty', async () => {
    const id = mock.addInteraction('post test-summary to teams with qc-test-summary', { quickChartUrl: "https://quickchart.io" });
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message"
            },
            "extensions": [
              {
                "name": "quick-chart-test-summary",
                "inputs": {
                  "url": " "
                }
              }
            ]
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


  afterEach(() => {
    mock.clearInteractions();
  });

});