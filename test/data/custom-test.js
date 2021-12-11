const p6 = require('pactum');

async function send() {
  await p6.spec().get('http://localhost:9393/custom');
}

module.exports = {
  send
}