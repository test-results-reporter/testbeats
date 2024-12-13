const os = require('os');
const pkg = require('../../../package.json');

function info() {
  function getRuntimeInfo() {
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      return { name: 'node', version: process.versions.node };
    } else if (typeof Deno !== 'undefined') {
      return { name: 'deno', version: Deno.version.deno };
    } else if (typeof Bun !== 'undefined') {
      return { name: 'bun', version: Bun.version };
    } else {
      return { name: 'unknown', version: 'unknown' };
    }
  }

  const runtime = getRuntimeInfo();

  return {
    runtime: runtime.name,
    runtime_version: runtime.version,
    os: os.platform(),
    os_version: os.release(),
    testbeats_version: pkg.version
  }
}

module.exports = {
  info
}