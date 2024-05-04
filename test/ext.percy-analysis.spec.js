const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - percy-analysis', () => {

  it('should send percy-analysis to teams', async () => {
    const id1 = mock.addInteraction('get percy project');
    const id2 = mock.addInteraction('get last build from percy');
    const id3 = mock.addInteraction('get empty removed snapshots from percy');
    const id4 = mock.addInteraction('post test-summary to teams with percy analysis');
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
    assert.equal(mock.getInteraction(id4).exercised, true);
  });

  it('should send percy-analysis to slack', async () => {
    const id1 = mock.addInteraction('get percy project');
    const id2 = mock.addInteraction('get last build from percy');
    const id3 = mock.addInteraction('get empty removed snapshots from percy');
    const id4 = mock.addInteraction('post test-summary to slack with percy analysis');
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
    assert.equal(mock.getInteraction(id4).exercised, true);
  });

  it('should send percy-analysis to chat', async () => {
    const id1 = mock.addInteraction('get percy project');
    const id2 = mock.addInteraction('get last build from percy');
    const id3 = mock.addInteraction('get empty removed snapshots from percy');
    const id4 = mock.addInteraction('post test-summary to chat with percy analysis');
    await publish({
      config: {
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
    assert.equal(mock.getInteraction(id4).exercised, true);
  });

  it('should send percy-analysis with removed snapshots to chat', async () => {
    const id1 = mock.addInteraction('get percy project');
    const id2 = mock.addInteraction('get last build from percy');
    const id3 = mock.addInteraction('get removed snapshots from percy');
    const id4 = mock.addInteraction('post percy analysis with removed snapshots to chat');
    await publish({
      config: {
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
    assert.equal(mock.getInteraction(id4).exercised, true);
  });

  it('should send percy-analysis with un-reviewed snapshots to chat', async () => {
    const id1 = mock.addInteraction('get percy project');
    const id2 = mock.addInteraction('get last build with un-reviewed snapshots from percy');
    const id3 = mock.addInteraction('get removed snapshots from percy');
    const id4 = mock.addInteraction('post percy analysis with un-reviewed snapshots to chat');
    await publish({
      config: {
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
    assert.equal(mock.getInteraction(id4).exercised, true);
  });

  it('should send percy-analysis with build-id to chat', async () => {
    const id1 = mock.addInteraction('get build from percy');
    const id2 = mock.addInteraction('get empty removed snapshots from percy');
    const id3 = mock.addInteraction('post test-summary to chat with percy analysis');
    await publish({
      config: {
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
                  "build_id": "build-id"
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
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('should send percy-analysis with project-id to chat', async () => {
    const id1 = mock.addInteraction('get last build from percy');
    const id2 = mock.addInteraction('get empty removed snapshots from percy');
    const id3 = mock.addInteraction('post test-summary to chat with percy analysis');
    await publish({
      config: {
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
                  "project_id": "project-id"
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
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});