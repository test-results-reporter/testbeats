const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('global extensions', () => {

  afterEach(() => {
    mock.clearInteractions();
  });

  it('with global extensions', async () => {
    const id = mock.addInteraction('post test-summary with metadata to teams');
    await publish({
      config: {
        "targets": [
          {
            "name": "teams",
            "inputs": {
              "url": "http://localhost:9393/message"
            },
          }
        ],
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

  it('with global and normal extensions', async () => {
    const id = mock.addInteraction('post test-summary with metadata and hyperlinks to teams');
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
                "name": "hyperlinks",
                "inputs": {
                  "links": [
                    {
                      "text": "Pipeline",
                      "url": "some-url"
                    },
                    {
                      "text": "Video",
                      "url": "some-url",
                      "condition": "pass"
                    }
                  ]
                }
              }
            ],
          }
        ],
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

  it('with extensions ordered by order property', async () => {
    const id = mock.addInteraction('post test-summary with ordered extensions to teams');
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
                "name": "hyperlinks",
                "order": 1000,
                "inputs": {
                  "links": [
                    {
                      "text": "local-hyperlink",
                      "url": "local-url"
                    }
                  ]
                }
              },
              {
                "name": "metadata",
                "order": 500,
                "inputs": {
                  "data": [
                    {
                      "key": "Browser",
                      "value": "Chrome"
                    }
                  ]
                }
              }
            ],
          }
        ],
        "extensions": [
          {
            "name": "hyperlinks",
            "order": 100,
            "inputs": {
              "links": [
                {
                  "text": "global-hyperlink",
                  "url": "global-url"
                }
              ]
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