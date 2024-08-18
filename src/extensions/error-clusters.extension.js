const { BaseExtension } = require('./base.extension');
const { STATUS, HOOK } = require("../helpers/constants");

class ErrorClustersExtension extends BaseExtension {

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
    this.default_inputs.title = 'Top Errors';
    this.default_inputs.title_link = '';
  }

  #setText() {
    const data = this.extension.inputs.data;
    if (!data || !data.length) {
      return;
    }

    const clusters = data;

    this.extension.inputs.title = `Top ${clusters.length} Errors`;

    const texts = [];
    for (const cluster of clusters) {
      texts.push(`${this.bold(`(${cluster.count})`)} - ${cluster.failure}`);
    }
    this.text = this.mergeTexts(texts);
  }
}

module.exports =  { ErrorClustersExtension }