const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - hyperlink', () => {

  it('should send test-summary with links to teams', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to teams');
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
                    "name": "hyperlink",
                    "inputs": {
                      "links": [
                        {
                          "text": "Pipeline",
                          "url": "some-url"
                        },
                        {
                          "text": "Video",
                          "url": "some-url"
                        }
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
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with links to slack', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to slack');
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
                    "name": "hyperlink",
                    "inputs": {
                      "links": [
                        {
                          "text": "Pipeline",
                          "url": "some-url"
                        },
                        {
                          "text": "Video",
                          "url": "some-url"
                        }
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
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});