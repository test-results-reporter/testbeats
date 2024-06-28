const assert = require('assert');
const { publish } = require("../src");

describe('Config', () => {

  it('should not allow missing options', async () => {
    let e;
    try {
      await publish();
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'Missing publish options');
  });

  it('should not allow missing config', async () => {
    let e;
    try {
      await publish({});
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'Missing results properties in config');
  });

  it('should not allow missing config file', async () => {
    let e;
    try {
      await publish({ config: 'as.json' });
    } catch (err) {
      e = err;
    }
    assert.match(e.message, /Failed to read config file:/);
  });

  it('should not allow empty config', async () => {
    let e;
    try {
      await publish({
        config: {}
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'Missing results properties in config');
  });

  it('should not alow invalid results', async () => {
    let e;
    try {
      await publish({
        config: {
          results: {}
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, `'config.results' must be an array`);
  });

  it('should not alow custom type results with out result', async () => {
    let e;
    try {
      await publish({
        config: {
          results: [
            {
              type: 'custom'
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, `custom 'config.results[*].result' is missing`);
  });

  it('should not allow empty results', async () => {
    let e;
    try {
      await publish({
        config: {
          results: []
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'At least one result must be defined');
  });

  it('should not allow empty result object', async () => {
    let e;
    try {
      await publish({
        config: {
          results: [
            {}
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'Missing result type');
  });

  it('should not allow result without files', async () => {
    let e;
    try {
      await publish({
        config: {
          results: [
            {
              type: 'mocha',
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'Missing result files');
  });

  it('should not allow result with invalid files', async () => {
    let e;
    try {
      await publish({
        config: {
          results: [
            {
              type: 'mocha',
              files: ''
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'Missing result files');
  });

  it('should not allow result with files as string', async () => {
    let e;
    try {
      await publish({
        config: {
          results: [
            {
              type: 'mocha',
              files: 'some string'
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'result files must be an array');
  });

  it('should not allow result with empty files', async () => {
    let e;
    try {
      await publish({
        config: {
          results: [
            {
              type: 'mocha',
              files: []
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'At least one result file must be defined');
  });

  it('should not allow with invalid target', async () => {
    let e;
    try {
      await publish({
        config: {
          targets: 'some',
          results: [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml"
              ]
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'targets must be an array');
  });

  it('should not allow with missing target name', async () => {
    let e;
    try {
      await publish({
        config: {
          targets: [{}],
          results: [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml"
              ]
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, `'config.targets[*].name' is missing`);
  });

  it('should not allow with missing target url', async () => {
    let e;
    try {
      await publish({
        config: {
          targets: [
            {
              name: 'slack',
              inputs: {
                url: {}
              }
            }
          ],
          results: [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml"
              ]
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, `url in slack target inputs must be a string`);
  });

  it('should not allow with invalid target inputs', async () => {
    let e;
    try {
      await publish({
        config: {
          targets: [
            {
              name: 'teams',
            }
          ],
          results: [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml"
              ]
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'missing inputs in teams target');
  });

  it('should not allow with missing url target input', async () => {
    let e;
    try {
      await publish({
        config: {
          targets: [
            {
              name: 'teams',
              inputs: {}
            }
          ],
          results: [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml"
              ]
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'missing url in teams target inputs');
  });

  it('should not allow with empty url target input', async () => {
    let e;
    try {
      await publish({
        config: {
          targets: [
            {
              name: 'teams',
              inputs: {
                url: ''
              }
            }
          ],
          results: [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml"
              ]
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, 'missing url in teams target inputs');
  });

  it('should not allow with invalid url target input', async () => {
    let e;
    try {
      await publish({
        config: {
          targets: [
            {
              name: 'teams',
              inputs: {
                url: 'some'
              }
            }
          ],
          results: [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml"
              ]
            }
          ]
        }
      });
    } catch (err) {
      e = err;
    }
    assert.equal(e.message, `url in teams target inputs must start with 'http' or 'https'`);
  });

});