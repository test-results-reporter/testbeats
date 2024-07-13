const p6 = require('pactum');
const assert = require('assert');

async function run({ target, result }) {
  assert.equal(target.name, 'custom');
  assert.equal(result.name, 'Default suite');
  await p6.spec().get('http://localhost:9393/custom');
}

module.exports = {
  run
}