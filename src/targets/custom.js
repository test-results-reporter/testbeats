const path = require('path');

async function send(options, results) {
  const cwd = process.cwd();
  const target = require(path.join(cwd, options.path));
  await target.send(options, results);
}

module.exports = {
  send
}