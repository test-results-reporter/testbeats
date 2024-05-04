const { mock, spec } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('targets - custom', () => {

  it('load from fs', async () => {
    const id1 = mock.addInteraction('get custom');
    await publish({
      config: 'test/data/configs/custom-target.json'
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
  });

  it('load from inline function', async () => {
    const id1 = mock.addInteraction('get custom');
    await publish({
      config: {
        "targets": [
          {
            "name": "custom",
            "inputs": {
              "load": async function ({ target, result }) {
                assert.equal(target.name, 'custom');
                assert.equal(result.name, 'Default suite');
                await spec().get('http://localhost:9393/custom');
              }
            }
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

  it('invalid load', async () => {
    let err;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "custom",
              "inputs": {
                "load": {}
              }
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
    } catch (error) {
      err = error
    }
    assert.equal(err, `Invalid 'load' input in custom target - [object Object]`);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});