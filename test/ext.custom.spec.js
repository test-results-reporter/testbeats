const { mock, spec } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - custom', () => {

  it('load from fs', async () => {
    const id1 = mock.addInteraction('post test-summary to teams');
    const id2 = mock.addInteraction('get custom');
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
                "name": "custom",
                "inputs": {
                  "load": "test/data/custom/custom-runner.js"
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
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  it('load from inline function', async () => {
    const id1 = mock.addInteraction('post test-summary to teams');
    const id2 = mock.addInteraction('get custom');
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
                "name": "custom",
                "inputs": {
                  "load": async function ({ target, extension, result }) {
                    assert.equal(target.name, 'teams');
                    assert.equal(extension.name, 'custom');
                    assert.equal(result.name, 'Default suite');
                    await spec().get('http://localhost:9393/custom');
                  }
                }
              }
            ]
          }
        ],
        "results": [
          {
            "type": "junit",
            "files": [
              "test/data/junit/single-suite.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  it('invalid load', async () => {
    const id1 = mock.addInteraction('post test-summary to teams');
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
                "name": "custom",
                "inputs": {
                  "load": {}
                }
              }
            ]
          }
        ],
        "results": [
          {
            "type": "junit",
            "files": [
              "test/data/junit/single-suite.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});