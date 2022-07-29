const path = require('path');
const { HOOK, STATUS } = require('../helpers/constants');

/**
 * 
 * @param {object} param0 
 * @param {import('../index').CustomExtension} param0.extension 
 */
async function run({ target, extension, payload, root_payload, result }) {
  if (typeof extension.inputs.load === 'string') {
    const cwd = process.cwd();
    const extension_runner = require(path.join(cwd, extension.inputs.load));
    await extension_runner.run({ target, extension, payload, root_payload, result });
  } else if (typeof extension.inputs.load === 'function') {
    await extension.inputs.load({ target, extension, payload, root_payload, result });
  } else {
    throw `Invalid 'load' input in custom extension - ${extension.inputs.load}`;
  }
}

const default_options = {
  hook: HOOK.END,
  condition: STATUS.PASS_OR_FAIL
}

module.exports = {
  run,
  default_options
}