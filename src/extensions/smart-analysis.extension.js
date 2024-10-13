const { BaseExtension } = require('./base.extension');
const { STATUS, HOOK } = require("../helpers/constants");
const logger = require('../utils/logger');

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
    this.default_inputs.title = '';
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

    if (!execution_metrics) {
      logger.warn('⚠️ No execution metrics found. Skipping.');
      return;
    }

    const smart_analysis = [];
    if (execution_metrics.newly_failed) {
      smart_analysis.push(`⭕ Newly Failed: ${execution_metrics.newly_failed}`);
    }
    if (execution_metrics.always_failing) {
      smart_analysis.push(`🔴 Always Failing: ${execution_metrics.always_failing}`);
    }
    if (execution_metrics.recurring_errors) {
      smart_analysis.push(`🟠 Recurring Errors: ${execution_metrics.recurring_errors}`);
    }
    if (execution_metrics.flaky) {
      smart_analysis.push(`🟡 Flaky: ${execution_metrics.flaky}`);
    }
    if (execution_metrics.recovered) {
      smart_analysis.push(`🟢 Recovered: ${execution_metrics.recovered}`);
    }

    const texts = [];
    const rows = [];
    for (const item of smart_analysis) {
      rows.push(item);
      if (rows.length === 3) {
        texts.push(rows.join('  •  '));
        rows.length = 0;
      }
    }

    if (rows.length > 0) {
      texts.push(rows.join('  •  '));
    }

    this.text = this.mergeTexts(texts);
  }

}

module.exports =  { SmartAnalysisExtension };