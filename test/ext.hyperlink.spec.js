const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - hyperlinks', () => {

  it('should send test-summary with links to teams - default condition', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to teams - pass status');
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

  it('should send test-summary with links to teams - conditional hyperlinks - pass', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to teams - pass status');
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

  it('should send test-summary with links to teams - conditional hyperlinks - multiconditions', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to teams - fail status');
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
                    "name": "hyperlinks",
                    "inputs": {
                      "links": [
                        {
                          "text": "Pipeline",
                          "url": "some-url",
                        },
                        {
                          "text": "S3 link",
                          "url": "some-url",
                          "condition": "pass"
                        },
                        {
                          "text": "Video",
                          "url": "some-url",
                          "condition": "fail"
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
                  "test/data/testng/single-suite-failures.xml"
                ]
              }
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with links to slack - default condition', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to slack - pass status');
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

  it('should send test-summary with links to slack - conditional hyperlinks - pass', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to slack - pass status');
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
                    "name": "hyperlinks",
                    "inputs": {
                      "links": [
                        {
                          "text": "Pipeline",
                          "url": "some-url"
                        },
                        {
                          "text": "S3 link",
                          "url": "some-url",
                          "condition": "fail"
                        },
                        {
                          "text": "Video",
                          "url": "some-url",
                          "condition": "pass"
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

  it('should send test-summary with links to slack - conditional hyperlinks - multiconditions', async () => {
    const id = mock.addInteraction('post test-summary with hyperlinks to slack - fail status');
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
                    "name": "hyperlinks",
                    "inputs": {
                      "links": [
                        {
                          "text": "Pipeline",
                          "url": "some-url",
                        },
                        {
                          "text": "S3 link",
                          "url": "some-url",
                          "condition": "pass"
                        },
                        {
                          "text": "Video",
                          "url": "some-url",
                          "condition": "fail"
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
                  "test/data/testng/single-suite-failures.xml"
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