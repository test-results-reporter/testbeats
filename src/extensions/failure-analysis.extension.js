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
    /**
     * @type {import('../beats/beats.types').IFailureAnalysisMetric[]}
     */
    const metrics = this.extension.inputs.data;
    if (!metrics || metrics.length === 0) {
      logger.warn('⚠️ No failure analysis metrics found. Skipping.');
      return;
    }

    const to_investigate = metrics.find(metric => metric.name === 'To Investigate');
    const auto_analysed = metrics.find(metric => metric.name === 'Auto Analysed');

    const failure_analysis = [];

    if (to_investigate && to_investigate.count > 0) {
      failure_analysis.push(`🔎 To Investigate: ${to_investigate.count}`);
    }
    if (auto_analysed && auto_analysed.count > 0) {
      failure_analysis.push(`🪄 Auto Analysed: ${auto_analysed.count}`);
    }

    if (failure_analysis.length === 0) {
      return;
    }

    this.text = failure_analysis.join('    ');
  }

}

module.exports =  { FailureAnalysisExtension };