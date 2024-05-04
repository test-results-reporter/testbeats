const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - report-portal-history', () => {

  it('should send report-portal-history to teams', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('get suite history');
    const id3 = mock.addInteraction('post test-summary to teams with report portal history');
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
                "name": "report-portal-history",
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('should send report-portal-history to slack', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('get suite history');
    const id3 = mock.addInteraction('post test-summary to slack with report portal history');
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
                "name": "report-portal-history",
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('should send report-portal-history with launch name', async () => {
    const id1 = mock.addInteraction('get last launch details');
    const id2 = mock.addInteraction('post test-summary to teams with report portal history');
    const id3 = mock.addInteraction('get suite history');
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
                "name": "report-portal-history",
                "inputs": {
                  "url": "http://localhost:9393",
                  "api_key": "abc",
                  "project": "project-name",
                  "launch_name": "smoke"
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

  it('should send report-portal-history with launch id and name', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('get suite history');
    const id3 = mock.addInteraction('post test-summary to teams with report portal history');
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
                "name": "report-portal-history",
                "inputs": {
                  "url": "http://localhost:9393",
                  "api_key": "abc",
                  "project": "project-name",
                  "launch_name": "smoke",
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('should not send report-portal-history to teams', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('get empty suite history');
    const id3 = mock.addInteraction('post test-summary to teams');
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
                "name": "report-portal-history",
                "condition": "passOrFail",
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
              "test/data/testng/single-suite.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('should send report-portal-history to teams without title and separator', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('get suite history');
    const id3 = mock.addInteraction('post test-summary to teams with report portal history without title and separator');
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
                "name": "report-portal-history",
                "inputs": {
                  "url": "http://localhost:9393",
                  "api_key": "abc",
                  "project": "project-name",
                  "launch_id": "id123",
                  "title": "",
                  "separator": false
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

  it('should send report-portal-history to chat', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('get suite history');
    const id3 = mock.addInteraction('post test-summary to chat with report portal history');
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
                "name": "report-portal-history",
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});