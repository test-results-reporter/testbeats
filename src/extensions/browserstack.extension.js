const { HOOK, STATUS } = require("../helpers/constants");
const { getMetaDataText } = require("../helpers/metadata.helper");
const { BaseExtension } = require("./base.extension");


class BrowserstackExtension extends BaseExtension {
  constructor(target, extension, result, payload, root_payload) {
    super(target, extension, result, payload, root_payload);
    this.#setDefaultOptions();
  }

  #setDefaultOptions() {
    this.default_options.hook = HOOK.AFTER_SUMMARY;
    this.default_options.condition = STATUS.PASS_OR_FAIL;
  }

  async run() {
    this.extension.inputs = Object.assign({}, this.extension.inputs);
    /** @type {import('../index').BrowserstackInputs} */
    const inputs = this.extension.inputs;
    if (inputs.automation_build) {
      const element = { label: 'Browserstack', key: inputs.automation_build.name, value: inputs.automation_build.public_url, type: 'hyperlink' }
      const text = await getMetaDataText({ elements: [element], target: this.target, extension: this.extension, result: this.result, default_condition: this.default_options.condition });
      this.text = text;
      this.attach();
    }
  }
}

module.exports = { BrowserstackExtension };