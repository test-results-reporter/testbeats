const { getCIInformation } = require('../helpers/ci');
const logger = require('../utils/logger');
const { BeatsApi } = require('./beats.api');
const { HOOK } = require('../helpers/constants');
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
  }

  async publish() {
    this.#setCIInfo();
    this.#setProjectName();
    this.#setRunName();
    this.#setApiKey();
    await this.#publishTestResults();
    await this.#uploadAttachments();
    this.#updateTitleLink();
    await this.#attachFailureSummary();
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
  }

  async #publishTestResults() {
    if (!this.config.api_key) {
      logger.warn('😿 No API key provided, skipping publishing results to TestBeats Portal...');
      return;
    }
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

  #getAllFailedTestCases() {
    const test_cases = [];
    for (const suite of this.result.suites) {
      for (const test of suite.cases) {
        if (test.status === 'FAIL') {
          test_cases.push(test);
        }
      }
    }
    return test_cases;
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

  async #attachFailureSummary() {
    if (!this.test_run_id) {
      return;
    }
    if (!this.config.targets) {
      return;
    }
    if (this.result.status !== 'FAIL') {
      return;
    }
    if (this.config.show_failure_summary === false) {
      return;
    }
    const text = await this.#getFailureSummary();
    if (!text) {
      return;
    }
    const extension = this.#getAIFailureSummaryExtension(text);
    for (const target of this.config.targets) {
      target.extensions = target.extensions || [];
      target.extensions.push(extension);
    }
  }

  async #getFailureSummary() {
    logger.info('✨ Fetching AI Failure Summary...');
    let retry = 3;
    while (retry >= 0) {
      retry = retry - 1;
      await new Promise(resolve => setTimeout(resolve, this.#getDelay()));
      const test_run = await this.api.getTestRun(this.test_run_id);
      const status = test_run && test_run.failure_summary_status;
      switch (status) {
        case 'COMPLETED':
          return test_run.execution_metrics[0].failure_summary;
        case 'FAILED':
          logger.error(`❌ Failed to generate AI Failure Summary`);
          return;
        case 'SKIPPED':
          logger.warn(`❗ Skipped generating AI Failure Summary`);
          return;
      }
      logger.info(`🔄 AI Failure Summary not generated, retrying...`);
    }
    logger.warn(`🙈 AI Failure Summary not generated in given time`);
  }

  #getDelay() {
    if (process.env.TEST_BEATS_DELAY) {
      return parseInt(process.env.TEST_BEATS_DELAY);
    }
    return 3000;
  }

  #getAIFailureSummaryExtension(text) {
    return {
      name: 'ai-failure-summary',
      hook: HOOK.AFTER_SUMMARY,
      inputs: {
        failure_summary: text
      }
    };
  }

}

module.exports = { Beats }