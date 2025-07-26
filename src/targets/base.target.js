const { getPlatform } = require('../platforms');
const { STATUS } = require('../helpers/constants');

class BaseTarget {

  constructor({ target }) {

    /**
     * @type {import('../index').ITarget}
     */
    this.target = target;

    /**
     * @type {string}
     */
    this.name = target.name;

    /**
     * @type {string | boolean}
     */
    this.enable = target.enable;

    /**
     * @type {import('../index').Condition}
     */
    this.condition = target.condition || STATUS.PASS_OR_FAIL;

    /**
     * @type {import('../index').IExtension[]}
     */
    this.extensions = target.extensions || [];

    /**
     * @type {import('../platforms/base.platform').BasePlatform}
     */
    this.platform = getPlatform(this.name);
  }

  async run({ result }) {
    // throw new Error('Not implemented');
  }

}

  module.exports = { BaseTarget};