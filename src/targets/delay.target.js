const { BaseTarget } = require('./base.target');

const DEFAULT_INPUTS = {
  seconds: 5
};

class DelayTarget extends BaseTarget {

  constructor({ target }) {
    super({ target });

    /**
     * @type {import('../index').IDelayTargetInputs}
     */
    this.inputs = Object.assign({}, DEFAULT_INPUTS, target.inputs);
  }

  async run() {
    await new Promise(resolve => setTimeout(resolve, this.inputs.seconds * 1000));
  }

}

module.exports = { DelayTarget };