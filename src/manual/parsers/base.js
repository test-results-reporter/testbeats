const hash = require('object-hash');

class BaseParser {

  /**
   * @param {import('fs')} fs
   */
  constructor(fs) {
    /**
     * @type {import('fs')}
     */
    this.fs = fs;
  }

  hash(obj) {
    return hash(obj, { algorithm: 'md5' });
  }

  /**
   * Hash a test case
   * @param {import('../../types').IManualTestCase} testCase
   * @returns {string}
   */
  hashTestCase(testCase) {
    return this.hash({
      name: testCase.name,
      type: testCase.type,
      tags: testCase.tags,
      steps: testCase.steps,
      path: testCase.path
    });
  }

  /**
   * Hash a test suite
   * @param {import('../../types').IManualTestSuite} testSuite
   * @returns {string}
   */
  hashTestSuite(testSuite) {
    return this.hash({
      name: testSuite.name,
      type: testSuite.type,
      tags: testSuite.tags,
      before_each: testSuite.before_each,
      test_cases: testSuite.test_cases.map(testCase => testCase.hash)
    });
  }
}

module.exports = { BaseParser };