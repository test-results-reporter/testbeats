const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require("../src");

describe('TestBeats', () => {

  it('should send results to beats', async () => {
    const id1 = mock.addInteraction('post test results to testbeats');
    const id2 = mock.addInteraction('post test-summary with testbeats to teams');
    await publish({
      config: {
        api_key: 'api-key',
        project: 'project-name',
        build: 'build-name',
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            }
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/single-suite.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  it('should send results to beats with extensions', async () => {
    const id1 = mock.addInteraction('post test results to testbeats');
    const id2 = mock.addInteraction('post test-summary with extensions and testbeats to teams');
    await publish({
      config: {
        api_key: 'api-key',
        project: 'project-name',
        build: 'build-name',
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
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
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/single-suite.xml'
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