const hash = require('object-hash');

/**
 * Handles all hashing operations for manual test entities
 * Centralizes hashing logic with configurable algorithm
 */
class ManualTestHasher {
  /**
   * @param {string} algorithm - Hashing algorithm (default: 'md5')
   */
  constructor(algorithm = 'md5') {
    this.algorithm = algorithm;
  }

  /**
   * Generate hash for any object
   * @param {Object} obj - Object to hash
   * @returns {string} Hash string
   */
  hash(obj) {
    return hash(obj, { algorithm: this.algorithm });
  }

  /**
   * Hash a test case
   * @param {import('../types').IManualTestCase} testCase
   * @returns {string} Hash string
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
   * @param {import('../types').IManualTestSuite} testSuite
   * @returns {string} Hash string
   */
  hashTestSuite(testSuite) {
    return this.hash({
      name: testSuite.name,
      type: testSuite.type,
      tags: testSuite.tags,
      before_each: testSuite.before_each,
      test_cases: testSuite.test_cases.map(tc => tc.hash)
    });
  }

  /**
   * Hash a folder
   * @param {import('../types').IManualTestFolder} folder
   * @returns {string} Hash string
   */
  hashFolder(folder) {
    return this.hash({
      name: folder.name,
      path: folder.path,
      test_suites: folder.test_suites.map(ts => ts.hash),
      folders: folder.folders.map(f => f.hash)
    });
  }

  /**
   * Recursively hash an entire folder structure
   * Adds hash properties to all test cases, test suites, and folders
   * @param {import('../types').IManualTestFolder} structure - Folder structure to hash
   * @returns {import('../types').IManualTestFolder} Same structure with hashes added (mutates in place)
   */
  hashStructure(structure) {
    for (const testSuite of structure.test_suites) {
      for (const testCase of testSuite.test_cases) {
        testCase.hash = this.hashTestCase(testCase);
      }
      testSuite.hash = this.hashTestSuite(testSuite);
    }

    for (const subFolder of structure.folders) {
      this.hashStructure(subFolder);
    }

    structure.hash = this.hashFolder(structure);

    return structure;
  }
}

module.exports = { ManualTestHasher };

