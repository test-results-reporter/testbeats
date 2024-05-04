const { publish } = require('../src');

describe('targets - delay', () => {

  it('delay for sometime', async () => {
    await publish({
      config: {
        "targets": [
          {
            "name": "delay",
            "inputs": {
              "seconds": 0.00001
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
  });

});