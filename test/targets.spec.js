const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('Targets', () => {

  it('disable target', async () => {
    const id = mock.addInteraction('post test-summary to slack');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
            "inputs": {
              "url": "http://localhost:9393/message"
            }
          },
          {
            name: 'teams',
            enable: false
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

  it('disable extension', async () => {
    const id = mock.addInteraction('post test-summary to slack');
    await publish({
      config: {
        "targets": [
          {
            "name": "slack",
            "inputs": {
              "url": "http://localhost:9393/message"
            }
          }
        ],
        "extensions": [
          {
            name: 'ci-info',
            enable: false
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