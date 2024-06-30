const { BaseExtension } = require('./base.extension');
const { STATUS, HOOK } = require("../helpers/constants");

class SmartAnalysisExtension extends BaseExtension {

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
    this.default_inputs.title = 'Smart Analysis';
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

    const smart_analysis = [];
    if (execution_metrics.always_failing) {
      smart_analysis.push(`🚫 AF: ${execution_metrics.always_failing}`);
    }
    if (execution_metrics.newly_failed) {
      smart_analysis.push(`⭕ NF: ${execution_metrics.newly_failed}`);
    }
    if (execution_metrics.flaky) {
      smart_analysis.push(`❄️ FL: ${execution_metrics.flaky}`);
    }
    if (execution_metrics.recovered) {
      smart_analysis.push(`🟢 RC: ${execution_metrics.recovered}`);
    }

    this.text = smart_analysis.join(' ｜ ');
  }

}

module.exports =  { SmartAnalysisExtension };