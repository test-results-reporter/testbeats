const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - report-portal-analysis', () => {

  it('should report-portal-analysis to teams', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to teams with report portal analysis');
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  it('should report-portal-analysis to slack', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to slack with report portal analysis');
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  it('should send report-portal-analysis with launch name', async () => {
    const id1 = mock.addInteraction('get last launch details');
    const id2 = mock.addInteraction('post test-summary to teams with report portal analysis');
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
                "name": "report-portal-analysis",
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
  });

  it('should send report-portal-analysis with launch id and name', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to teams with report portal analysis');
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
                "name": "report-portal-analysis",
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
  });

  it('should report-portal-analysis to slack with separator and without title', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to slack with report portal analysis with separator and without title');
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
                "name": "report-portal-analysis",
                "inputs": {
                  "url": "http://localhost:9393",
                  "api_key": "abc",
                  "project": "project-name",
                  "launch_id": "id123",
                  "title": "",
                  "separator": true
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
  });

  it('should report-portal-analysis to teams with title_link', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to teams with report portal analysis with title_link');
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
                "name": "report-portal-analysis",
                "inputs": {
                  "url": "http://localhost:9393",
                  "api_key": "abc",
                  "project": "project-name",
                  "launch_id": "id123",
                  "title_link": "http://localhost:9393"
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
  });

  it('should report-portal-analysis to slack with title_link', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to slack with report portal analysis with title_link');
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
                "name": "report-portal-analysis",
                "inputs": {
                  "url": "http://localhost:9393",
                  "api_key": "abc",
                  "project": "project-name",
                  "launch_id": "id123",
                  "title_link": "http://localhost:9393"
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
  });

  it('should report-portal-analysis to chat', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to chat with report portal analysis');
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
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});