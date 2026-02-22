const { BaseExtension } = require('./base.extension');
const { STATUS, HOOK } = require("../helpers/constants");
const { truncate } = require('../helpers/helper');

class FailureSignaturesExtension extends BaseExtension {

  constructor(target, extension, result, payload, root_payload) {
    super(target, extension, result, payload, root_payload);
    this.#setDefaultOptions();
    this.#setDefaultInputs();
    this.updateExtensionInputs();
  }

  run() {
    this.#setText();
    this.attach();
  }

  #setDefaultOptions() {
    this.default_options.hook = HOOK.AFTER_SUMMARY,
    this.default_options.condition = STATUS.PASS_OR_FAIL;
  }

  #setDefaultInputs() {
    this.default_inputs.title = 'Top Failures';
    this.default_inputs.title_link = '';
  }

  #setText() {
    const signatures = this.extension.inputs.data;
    if (!signatures || !signatures.length) {
      return;
    }

    const texts = [];
    for (const signature of signatures) {
      texts.push(`${truncate(signature.signature, 150)} - ${this.bold(`(x${signature.count})`)}`);
    }
    this.text = this.platform.bullets(texts);
  }
}

module.exports =  { FailureSignaturesExtension }