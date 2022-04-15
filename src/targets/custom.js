const path = require('path');

async function run({result, target}) {
  const cwd = process.cwd();
  const target_runner = require(path.join(cwd, target.inputs.path));
  await target_runner.run({result, target});
}

const default_options = {
  condition: 'passOrFail'
}

module.exports = {
  run,
  default_options
}