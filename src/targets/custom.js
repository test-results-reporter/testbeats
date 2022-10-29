const path = require('path');
const { STATUS } = require('../helpers/constants');

/**
 * 
 * @param {object} param0 
 * @param {import('../index').Target} param0.target 
 */
async function run({result, target}) {
  if (typeof target.inputs.load === 'string') {
    const cwd = process.cwd();
    const target_runner = require(path.join(cwd, target.inputs.load));
    await target_runner.run({ target, result });
  } else if (typeof target.inputs.load === 'function') {
    await target.inputs.load({ target, result });
  } else {
    throw `Invalid 'load' input in custom target - ${target.inputs.load}`;
  }
}

const default_options = {
  condition: STATUS.PASS_OR_FAIL
}

module.exports = {
  run,
  default_options
}