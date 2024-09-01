const { getPercentage, getPrettyDuration } = require('../helpers/helper')

class BasePlatform {

  /**
   * @param {string|number} text
   */
  bold(text) {
    throw new Error('Not Implemented');
  }

  break() {
    throw new Error('Not Implemented');
  }

  /**
   *
   * @param {import('..').Target} target
   * @param {import('test-results-parser').ITestSuite} suite
   */
  getSuiteSummaryText(target, suite) {
    const suite_title = this.getSuiteTitle(suite);
    const suite_results_text = this.#getSuiteResultsText(suite);
    const duration_text = this.#getSuiteDurationText(target, suite);

    const texts = [
      this.bold(suite_title),
      this.break(),
      this.break(),
      suite_results_text,
      this.break(),
      duration_text,
    ];

    const metadata_text = this.getSuiteMetaDataText(suite);

    if (metadata_text) {
      texts.push(this.break());
      texts.push(this.break());
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
    return `${this.bold('Results')}: ${suite_results}`;
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
   * @param {import('..').Target} target
   * @param {import('test-results-parser').ITestSuite} suite
   */
  #getSuiteDurationText(target, suite) {
    const duration = this.getSuiteDuration(target, suite);
    return `${this.bold('Duration')}: ${duration}`
  }

  /**
   *
   * @param {import('..').Target} target
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

module.exports = { BasePlatform }