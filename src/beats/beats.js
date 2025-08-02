const { getCIInformation } = require('../helpers/ci');
const logger = require('../utils/logger');
const { BeatsApi } = require('./beats.api');
const { HOOK, PROCESS_STATUS } = require('../helpers/constants');
const TestResult = require('test-results-parser/src/models/TestResult');
const { BeatsAttachments } = require('./beats.attachments');

class Beats {

  /**
   * @param {import('../index').PublishReport} config
   * @param {TestResult} result
   */
  constructor(config, result) {
    this.config = config;
    this.result = result;
    this.api = new BeatsApi(config);
    this.test_run_id = '';
    this.test_run = null;
  }

  async publish() {
    this.#setApiKey();
    if (!this.config.api_key) {
      logger.warn('😿 No API key provided, skipping publishing results to TestBeats Portal...');
      return;
    }
    this.#setCIInfo();
    this.#setProjectName();
    this.#setRunName();
    await this.#publishTestResults();
    await this.#uploadAttachments();
    this.#updateTitleLink();
    await this.#attachExtensions();
  }

  #setCIInfo() {
    this.ci = getCIInformation();
  }

  #setProjectName() {
    this.config.project = this.config.project || process.env.TEST_BEATS_PROJECT || (this.ci && this.ci.repository_name) || 'demo-project';
  }

  #setApiKey() {
    this.config.api_key = this.config.api_key || process.env.TEST_BEATS_API_KEY;
  }

  #setRunName() {
    this.config.run = this.config.run || process.env.TEST_BEATS_RUN || (this.ci && this.ci.build_name) || 'demo-run';
    this.result.name = this.config.run;
  }

  async #publishTestResults() {
    logger.info("🚀 Publishing results to TestBeats Portal...");
    try {
      const payload = this.#getPayload();
      const response = await this.api.postTestRun(payload);
      this.test_run_id = response.id;
    } catch (error) {
      logger.error(`❌ Unable to publish results to TestBeats Portal: ${error.message}`, error);
    }
  }

  #getPayload() {
    const payload = {
      project: this.config.project,
      run: this.config.run,
      ...this.result
    }
    if (this.ci) {
      payload.ci_details = [this.ci];
    }
    return payload;
  }

  async #uploadAttachments() {
    if (!this.test_run_id) {
      return;
    }
    if (this.result.status !== 'FAIL') {
      return;
    }
    try {
      const attachments = new BeatsAttachments(this.config, this.result, this.test_run_id);
      await attachments.upload();
    } catch (error) {
      logger.error(`❌ Unable to upload attachments: ${error.message}`, error);
    }
  }

  #updateTitleLink() {
    if (!this.test_run_id) {
      return;
    }
    if (!this.config.targets) {
      return;
    }
    const link = `${this.api.getBaseUrl()}/reports/${this.test_run_id}`;
    for (const target of this.config.targets) {
      target.inputs.title_link = link;
    }
  }

  async #attachExtensions() {
    if (!this.test_run_id) {
      return;
    }
    if (!this.config.targets) {
      return;
    }
    await this.#attachFailureSummary();
    await this.#attachFailureAnalysis();
    await this.#attachSmartAnalysis();
    await this.#attachErrorClusters();
  }

  async #attachFailureSummary() {
    if (this.result.status !== 'FAIL') {
      return;
    }
    if (this.config.show_failure_summary === false) {
      return;
    }
    try {
      logger.info('✨ Fetching AI Failure Summary...');
      await this.#setTestRun(' AI Failure Summary', 'failure_summary_status');
      this.config.extensions.push({
        name: 'ai-failure-summary',
        hook: HOOK.AFTER_SUMMARY,
        order: 100,
        inputs: {
          data: this.test_run
        }
      });
    } catch (error) {
      logger.error(`❌ Unable to attach failure summary: ${error.message}`, error);
    }
  }

  async #attachFailureAnalysis() {
    if (this.result.status !== 'FAIL') {
      return;
    }
    if (this.config.show_failure_analysis === false) {
      return;
    }
    try {
      logger.info('🪄 Fetching Failure Analysis...');
      await this.#setTestRun('Failure Analysis Status', 'failure_analysis_status');
      const metrics = await this.api.getFailureAnalysis(this.test_run_id);
      this.config.extensions.push({
        name: 'failure-analysis',
        hook: HOOK.AFTER_SUMMARY,
        order: 200,
        inputs: {
          data: metrics
        }
      });
    } catch (error) {
      logger.error(`❌ Unable to attach failure analysis: ${error.message}`, error);
    }
  }

  async #attachSmartAnalysis() {
    if (this.config.show_smart_analysis === false) {
      return;
    }
    try {
      logger.info('🤓 Fetching Smart Analysis...');
      await this.#setTestRun('Smart Analysis', 'smart_analysis_status');
      this.config.extensions.push({
        name: 'smart-analysis',
        hook: HOOK.AFTER_SUMMARY,
        order: 300,
        inputs: {
          data: this.test_run
        }
      });
    } catch (error) {
      logger.error(`❌ Unable to attach smart analysis: ${error.message}`, error);
    }
  }

  #getDelay() {
    if (process.env.TEST_BEATS_DELAY) {
      return parseInt(process.env.TEST_BEATS_DELAY);
    }
    return 5000;
  }

  async #setTestRun(text, wait_for = 'smart_analysis_status') {
    if (this.test_run && this.test_run[wait_for] === PROCESS_STATUS.COMPLETED) {
      return;
    }
    let retry = 5;
    while (retry >= 0) {
      retry = retry - 1;
      await new Promise(resolve => setTimeout(resolve, this.#getDelay()));
      this.test_run = await this.api.getTestRun(this.test_run_id);
      const status = this.test_run && this.test_run[wait_for];
      switch (status) {
        case PROCESS_STATUS.COMPLETED:
          logger.debug(`☑️ ${text} generated successfully`);
          return;
        case PROCESS_STATUS.FAILED:
          logger.error(`❌ Failed to generate ${text}`);
          return;
        case PROCESS_STATUS.SKIPPED:
          logger.warn(`❗ Skipped generating ${text}`);
          return;
      }
      logger.info(`🔄 ${text} not generated, retrying...`);
    }
    logger.warn(`🙈 ${text} not generated in given time`);
  }

  async #attachErrorClusters() {
    if (this.result.status !== 'FAIL') {
      return;
    }
    if (this.config.show_error_clusters === false) {
      return;
    }
    try {
      logger.info('🧮 Fetching Error Clusters...');
      const res = await this.api.getErrorClusters(this.test_run_id, 3);
      this.config.extensions.push({
        name: 'error-clusters',
        hook: HOOK.AFTER_SUMMARY,
        order: 400,
        inputs: {
          data: res.values
        }
      });
    } catch (error) {
      logger.error(`❌ Unable to attach error clusters: ${error.message}`, error);
    }
  }

}

module.exports = { Beats }