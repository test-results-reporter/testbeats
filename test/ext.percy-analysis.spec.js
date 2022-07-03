const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - percy-analysis', () => {

  it('should send percy-analysis to teams', async () => {
    const id1 = mock.addInteraction('get percy project');
    const id2 = mock.addInteraction('get last build in percy');
    const id3 = mock.addInteraction('post test-summary to teams with percy analysis');
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
                    "name": "percy-analysis",
                    "inputs": {
                      "url": "http://localhost:9393",
                      "token": "token",
                      "project_name": "project-name"
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
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('should send percy-analysis to slack', async () => {
    const id1 = mock.addInteraction('get percy project');
    const id2 = mock.addInteraction('get last build in percy');
    const id3 = mock.addInteraction('post test-summary to slack with percy analysis');
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
                    "name": "percy-analysis",
                    "inputs": {
                      "url": "http://localhost:9393",
                      "token": "token",
                      "project_name": "project-name"
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
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('should percy-analysis to chat', async () => {
    const id1 = mock.addInteraction('get percy project');
    const id2 = mock.addInteraction('get last build in percy');
    const id3 = mock.addInteraction('post test-summary to chat with percy analysis');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "chat",
                "inputs": {
                  "url": "http://localhost:9393/message"
                },
                "extensions": [
                  {
                    "name": "percy-analysis",
                    "inputs": {
                      "url": "http://localhost:9393",
                      "token": "token",
                      "project_name": "project-name"
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
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});