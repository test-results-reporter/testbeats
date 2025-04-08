const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - browserstack', () => {

  it('should send test-summary with browserstack to teams', async () => {
    const id1 = mock.addInteraction('get automation builds');
    const id2 = mock.addInteraction('get automation build sessions');
    const id3 = mock.addInteraction('post test-summary with browserstack to teams');
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
            "name": "browserstack",
            "inputs": {
              "url": "http://localhost:9393",
              "username": "username",
              "access_key": "access_key",
              "automation_build_name": "build-name"
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
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('should send test-summary with browserstack to teams without automation build name', async () => {
    const id1 = mock.addInteraction('get automation builds');
    const id2 = mock.addInteraction('post test-summary to teams');
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
            "name": "browserstack",
            "inputs": {
              "url": "http://localhost:9393",
              "username": "username",
              "access_key": "access_key",
              "automation_build_name": "invalid-build-name"
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
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});