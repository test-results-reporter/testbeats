const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('Condition', () => {

  it('custom js expression at target - successful', async () => {
    const id = mock.addInteraction('post test-summary to teams');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "teams",
                "condition": "result.status === 'PASS'",
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
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('custom js expression at target - failure', async () => {
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "teams",
                "condition": "result.status === 'FAIL'",
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
        ]
      }
    });
  });

  it('custom js expression at extension - successful', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to teams - pass status');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "teams",
                "condition": "pass",
                "inputs": {
                  "url": "http://localhost:9393/message"
                },
                "extensions": [
                  {
                    "name": "hyperlinks",
                    "condition": "result.status === 'PASS'",
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

  it('custom js expression at hyperlink extension - failure', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to teams - pass status');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "teams",
                "condition": "pass",
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
                          "url": "some-url"
                        },
                        {
                          "text": "Fake",
                          "url": "some-url",
                          "condition": "result.status === 'FAIL'"
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

});