const { publish } = require('../src');
const { mock } = require('pactum');
const assert = require('assert');

describe('targets - http', () => {

  it('http', async () => {
    const id = mock.addInteraction('http');
    await publish({
      config: {
        "targets": [
          {
            "name": "http",
            "inputs": {
              "url": "http://localhost:9393/test",
              "method": "POST",
              "headers": {
                "Content-Type": "application/json"
              }
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