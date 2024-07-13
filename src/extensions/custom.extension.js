const path = require('path');
const { BaseExtension } = require("./base.extension");
const { STATUS, HOOK } = require("../helpers/constants");

class CustomExtension extends BaseExtension {

  /**
   * @param {import('..').CustomExtension} extension
   */
  constructor(target, extension, result, payload, root_payload) {
    super(target, extension, result, payload, root_payload);
    this.extension = extension;
    this.#setDefaultOptions();
    this.updateExtensionInputs();
  }

  #setDefaultOptions() {
    this.default_options.hook = HOOK.END,
    this.default_options.condition = STATUS.PASS_OR_FAIL;
  }

  async run() {
    const params = this.#getParams();
    if (typeof this.extension.inputs.load === 'string') {
      const cwd = process.cwd();
      const extension_runner = require(path.join(cwd, this.extension.inputs.load));
      await extension_runner.run(params);
    } else if (typeof this.extension.inputs.load === 'function') {
      await this.extension.inputs.load(params);
    } else {
      throw `Invalid 'load' input in custom extension - ${this.extension.inputs.load}`;
    }
  }

  #getParams() {
    return {
      target: this.target,
      extension: this.extension,
      payload: this.payload,
      root_payload: this.root_payload,
      result: this.result
    }
  }

}

module.exports = { CustomExtension }