const { getPlatform } = require('../platforms');
const { STATUS } = require('../helpers/constants');
const { getPercentage, getPrettyDuration } = require('../helpers/helper');

class BaseTarget {

  constructor({ target }) {

    /**
     * @type {import('../index').ITarget}
     */
    this.target = target;

    /**
     * @type {string}
     */
    this.name = target.name;

    /**
     * @type {string | boolean}
     */
    this.enable = target.enable;

    /**
     * @type {import('../index').Condition}
     */
    this.condition = target.condition || STATUS.PASS_OR_FAIL;

    /**
     * @type {import('../index').IExtension[]}
     */
    this.extensions = target.extensions || [];

    /**
     * @type {import('../platforms/base.platform').BasePlatform}
     */
    this.platform = getPlatform(this.name);

  }

  async run({ result }) {
    // throw new Error('Not implemented');
  }

  /**
   *
   * @param {import('..').ITarget} target
   * @param {import('test-results-parser').ITestSuite} suite
   */
  getSuiteSummaryText(target, suite) {
    const suite_title = this.getSuiteTitle(suite);
    const suite_results_text = this.#getSuiteResultsText(suite);
    const duration_text = this.#getSuiteDurationText(target, suite);

    const texts = [
      this.platform.bold(suite_title),
      this.platform.break(),
      this.platform.break(),
      suite_results_text,
      this.platform.break(),
      duration_text,
    ];

    const metadata_text = this.getSuiteMetaDataText(suite);

    if (metadata_text) {
      texts.push(this.platform.break());
      texts.push(this.platform.break());
      texts.push(metadata_text);
    }

    return texts.join('');
  }

  /**
   *
   * @param {import('test-results-parser').ITestSuite} suite
   * @returns {string}
   */
  getSuiteTitle(suite) {
    const emoji = suite.status === 'PASS' ? '✅' : suite.total === suite.skipped ? '⏭️' : '❌';
    return `${emoji} ${suite.name}`;
  }

  /**
   *
   * @param {import('test-results-parser').ITestSuite} suite
   * @returns {string}
   */
  #getSuiteResultsText(suite) {
    const suite_results = this.getSuiteResults(suite);
    return `${this.platform.bold('Results')}: ${suite_results}`;
  }

  /**
   *
   * @param {import('test-results-parser').ITestSuite} suite
   * @returns {string}
   */
  getSuiteResults(suite) {
    return `${suite.passed} / ${suite.total} Passed (${getPercentage(suite.passed, suite.total)}%)`;
  }

  /**
   *
   * @param {import('..').ITarget} target
   * @param {import('test-results-parser').ITestSuite} suite
   */
  #getSuiteDurationText(target, suite) {
    const duration = this.getSuiteDuration(target, suite);
    return `${this.platform.bold('Duration')}: ${duration}`
  }

  /**
   *
   * @param {import('..').ITarget} target
   * @param {import('test-results-parser').ITestSuite} suite
   */
  getSuiteDuration(target, suite) {
    return getPrettyDuration(suite.duration, target.inputs.duration);
  }

  /**
   *
   * @param {import('test-results-parser').ITestSuite} suite
   * @returns {string}
   */
  getSuiteMetaDataText(suite) {
    if (!suite || !suite.metadata) {
      return;
    }

    const texts = [];

    // webdriver io
    if (suite.metadata.device && typeof suite.metadata.device === 'string') {
      texts.push(`${suite.metadata.device}`);
    }

    if (suite.metadata.platform && suite.metadata.platform.name && suite.metadata.platform.version) {
      texts.push(`${suite.metadata.platform.name} ${suite.metadata.platform.version}`);
    }

    if (suite.metadata.browser && suite.metadata.browser.name && suite.metadata.browser.version) {
      texts.push(`${suite.metadata.browser.name} ${suite.metadata.browser.version}`);
    }

    // playwright
    if (suite.metadata.hostname && typeof suite.metadata.hostname === 'string') {
      texts.push(`${suite.metadata.hostname}`);
    }

    return texts.join(' • ');
  }

}

module.exports = { BaseTarget };