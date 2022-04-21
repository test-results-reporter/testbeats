const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - mentions', () => {

  it('should mention users in teams', async () => {
    const id = mock.addInteraction('post test-summary to teams with mentions');
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
                    "name": "mentions",
                    "inputs": {
                      "users": [
                        {
                          "name": "mom",
                          "teams_upn": "mom@family"
                        },
                        {
                          "name": "dad",
                          "teams_upn": "dad@family"
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

  it('should mention users with schedule in teams', async () => {
    const id = mock.addInteraction('post test-summary to teams with mentions');
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
                    "name": "mentions",
                    "inputs": {
                      "users": [
                        {
                          "name": "mom",
                          "teams_upn": "mom@family"
                        }
                      ],
                      "schedule": {
                        "layers": [
                          {
                            "user": {
                              "name": "dad",
                              "teams_upn": "dad@family"
                            }
                          }
                        ]
                      }
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

  it('should mention users in slack', async () => {
    const id = mock.addInteraction('post test-summary with mentions to slack');
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
                    "name": "mentions",
                    "inputs": {
                      "users": [
                        {
                          "name": "mom",
                          "slack_uid": "ULA15K66M"
                        },
                        {
                          "name": "dad",
                          "slack_uid": "ULA15K66N"
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

  it('should mention users with schedule rotation in slack', async () => {
    const id = mock.addInteraction('post test-summary with mentions to slack');
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
                    "name": "mentions",
                    "inputs": {
                      "users": [
                        {
                          "name": "mom",
                          "slack_uid": "ULA15K66M"
                        }
                      ],
                      "schedule": {
                        "layers": [
                          {
                            "rotation": {
                              "every": "week",
                              "users": [
                                {
                                  "name": "dad",
                                  "slack_uid": "ULA15K66N"
                                }
                              ]
                            }
                          }
                        ]
                      }
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