const { BaseTarget } = require('./base.target');
const path = require('path');

const DEFAULT_INPUTS = {};

class CustomTarget extends BaseTarget {

  constructor({ target }) {
    super({ target });

    /**
     * @type {import('../index').ICustomTargetInputs}
     */
    this.inputs = Object.assign({}, DEFAULT_INPUTS, target.inputs);
  }

  async run({ result }) {
    if (typeof this.inputs.load === 'string') {
      const cwd = process.cwd();
      const target_runner = require(path.join(cwd, this.inputs.load));
      await target_runner.run({ target: this.target, result });
    } else if (typeof this.inputs.load === 'function') {
      await this.inputs.load({ target: this.target, result });
    } else {
      throw `Invalid 'load' input in custom target - ${this.inputs.load}`;
    }
  }

}

module.exports = { CustomTarget };