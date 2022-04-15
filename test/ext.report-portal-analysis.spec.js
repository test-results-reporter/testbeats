const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - report-portal-analysis', () => {

  it('should send test-summary with links to teams', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to teams with report portal analysis');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "teams",
                "inputs": {
                  "url": "http://localhost:9393/message"
                },
                "extensions": [
                  {
                    "name": "report-portal-analysis",
                    "inputs": {
                      "url": "http://localhost:9393",
                      "api_key": "abc",
                      "project": "project-name",
                      "launch_id": "id123"
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
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  it('should send test-summary with links to slack', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to slack with report portal analysis');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "slack",
                "inputs": {
                  "url": "http://localhost:9393/message"
                },
                "extensions": [
                  {
                    "name": "report-portal-analysis",
                    "inputs": {
                      "url": "http://localhost:9393",
                      "api_key": "abc",
                      "project": "project-name",
                      "launch_id": "id123"
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
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});