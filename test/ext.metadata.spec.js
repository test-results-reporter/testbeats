const { mock } = require('pactum');
const assert = require('assert');
const { publish, defineConfig } = require('../src');

describe('extensions - metadata', () => {

  it('should send test-summary with metadata to teams', async () => {
    const id = mock.addInteraction('post test-summary with metadata to teams');
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
                "name": "metadata",
                "inputs": {
                  "data": [
                    {
                      "key": "Browser",
                      "value": "Chrome"
                    },
                    {
                      "value": "1920*1080"
                    },
                    {
                      "value": "1920*1080",
                      "condition": "never"
                    },
                    {
                      "key": "Pipeline",
                      "value": "some-url",
                      "type": "hyperlink"
                    },
                  ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with metadata to slack', async () => {
    const id = mock.addInteraction('post test-summary with metadata to slack');
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
                "name": "metadata",
                "inputs": {
                  "data": [
                    {
                      "key": "Browser",
                      "value": "Chrome"
                    },
                    {
                      "value": "1920*1080"
                    },
                    {
                      "value": "1920*1080",
                      "condition": "never"
                    },
                    {
                      "key": "Pipeline",
                      "value": "some-url",
                      "type": "hyperlink"
                    },
                  ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with metadata to chat', async () => {
    const id = mock.addInteraction('post test-summary with metadata to chat');
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
                "name": "metadata",
                "inputs": {
                  "data": [
                    {
                      "key": "Browser",
                      "value": "Chrome"
                    },
                    {
                      "value": "1920*1080"
                    },
                    {
                      "value": "1920*1080",
                      "condition": "never"
                    },
                    {
                      "key": "Pipeline",
                      "value": "some-url",
                      "type": "hyperlink"
                    },
                  ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});