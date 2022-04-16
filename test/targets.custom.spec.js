const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('targets - custom', () => {

  it('custom target', async () => {
    const id1 = mock.addInteraction('get custom');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "custom",
                "inputs": {
                  "path": "test/data/custom-test.js"
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
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});