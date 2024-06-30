const { BaseExtension } = require('./base.extension');
const { STATUS, HOOK } = require("../helpers/constants");


class AIFailureSummaryExtension extends BaseExtension {

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
    this.default_inputs.title = 'AI Failure Summary ✨';
    this.default_inputs.title_link = '';
  }

  #setText() {
    const data = this.extension.inputs.data;
    if (!data) {
      return;
    }

    /**
     * @type {import('../beats/beats.types').IBeatExecutionMetric}
     */
    const execution_metrics = data.execution_metrics[0];
    this.text = execution_metrics.failure_summary;
  }
}

module.exports =  { AIFailureSummaryExtension }