const { BaseTarget } = require('./base.target');
const request = require('phin-retry');

const DEFAULT_INPUTS = {
  url: '',
  method: 'POST',
  headers: {}
};

class HttpTarget extends BaseTarget {

  constructor({ target }) {
    super({ target });

    /**
     * @type {import('../index').IHttpTargetInputs}
     */
    this.inputs = Object.assign({}, DEFAULT_INPUTS, target.inputs);
  }

  async run({ result }) {
    const { url, method, headers } = this.inputs;
    await request.__fetch({
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: { result }
    });
  }

}

module.exports = { HttpTarget };