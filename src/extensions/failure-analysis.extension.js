const { BaseExtension } = require('./base.extension');
const { STATUS, HOOK } = require("../helpers/constants");

class FailureAnalysisExtension extends BaseExtension {

  constructor(target, extension, result, payload, root_payload) {
    super(target, extension, result, payload, root_payload);
    this.#setDefaultOptions();
    this.#setDefaultInputs();
    this.updateExtensionInputs();
  }

  #setDefaultOptions() {
    this.default_options.hook = HOOK.AFTER_SUMMARY,
    this.default_options.condition = STATUS.PASS_OR_FAIL;
  }

  #setDefaultInputs() {
    this.default_inputs.title = '';
    this.default_inputs.title_link = '';
  }

  run() {
    this.#setText();
    this.attach();
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

    if (!execution_metrics) {
      logger.warn('⚠️ No execution metrics found. Skipping.');
      return;
    }

    const failure_analysis = [];

    if (execution_metrics.to_investigate) {
      failure_analysis.push(`🔎 To Investigate: ${execution_metrics.to_investigate}`);
    }
    if (execution_metrics.auto_analysed) {
      failure_analysis.push(`🪄 Auto Analysed: ${execution_metrics.auto_analysed}`);
    }

    this.text = failure_analysis.join('  •  ');
  }

}

module.exports =  { FailureAnalysisExtension };