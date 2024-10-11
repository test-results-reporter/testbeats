const { getCIInformation } = require('../src/helpers/ci');
const assert = require('assert');

describe('CI', () => {

  it('should return default CI information', () => {
    const info = getCIInformation();

    assert.ok(typeof info.runtime === 'string', 'runtime should be a string');
    assert.ok(typeof info.runtime_version === 'string', 'runtime_version should be a string');
    assert.ok(typeof info.os === 'string', 'os should be a string');
    assert.ok(typeof info.os_version === 'string', 'os_version should be a string');
    assert.ok(typeof info.testbeats_version === 'string', 'testbeats_version should be a string');
    assert.ok(typeof info.user === 'string', 'user should be a string');
  });

});