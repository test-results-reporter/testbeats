const fs = require('fs');
const path = require('path');
const hash = require('object-hash');
const { GherkinParser } = require('./parsers/gherkin');
const logger = require('../utils/logger');

class ManualSyncHelper {
  constructor() {
    this.parser = new GherkinParser(fs);
  }

  /**
   * Generate hash for an object
   * @param {Object} obj - Object to hash
   * @returns {string} Hash string
   */
  generateHash(obj) {
    return hash(obj, { algorithm: 'md5' });
  }

  /**
   * Add hash to test case
   * @param {Object} testCase - Test case object
   * @returns {Object} Test case with hash
   */
  addTestCaseHash(testCase) {
    return {
      ...testCase,
      hash: this.generateHash(testCase)
    };
  }

  /**
   * Add hash to test suite
   * @param {Object} testSuite - Test suite object
   * @returns {Object} Test suite with hash
   */
  addTestSuiteHash(testSuite) {
    return {
      ...testSuite,
      hash: this.generateHash(testSuite),
      test_cases: testSuite.test_cases.map(testCase => this.addTestCaseHash(testCase))
    };
  }

  /**
   * Add hash to folder
   * @param {Object} folder - Folder object
   * @returns {Object} Folder with hash
   */
  addFolderHash(folder) {
    return {
      ...folder,
      hash: this.generateHash(folder),
      test_suites: folder.test_suites.map(testSuite => this.addTestSuiteHash(testSuite)),
      folders: folder.folders.map(subFolder => this.addFolderHash(subFolder))
    };
  }

  /**
   * Hash a folder
   * @param {import('../types').IManualTestFolder} folder
   * @returns {string} Hash string
   */
  hashFolder(folder) {
    return this.generateHash({
      name: folder.name,
      path: folder.path,
      test_suites: folder.test_suites.map(testSuite => testSuite.hash),
      folders: folder.folders.map(subFolder => subFolder.hash)
    });
  }

  /**
   * Hash a test suite
   * @param {import('../types').IManualTestSuite} testSuite
   * @returns {string} Hash string
   */
  hashTestSuite(testSuite) {
    return this.generateHash({
      name: testSuite.name,
      tags: testSuite.tags,
      before_each: testSuite.before_each,
      test_cases: testSuite.test_cases.map(testCase => testCase.hash)
    });
  }


  /**
   * Scan directory recursively and build folder structure
   * @param {string} directoryPath - Path to scan
   * @returns {Object} Folder structure with test suites and hashes
   */
  async scanDirectory(directoryPath) {
    const absolutePath = path.resolve(directoryPath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Directory does not exist: ${directoryPath}`);
    }

    if (!fs.statSync(absolutePath).isDirectory()) {
      throw new Error(`Path is not a directory: ${directoryPath}`);
    }

    return this.buildFolderStructure(absolutePath, directoryPath);
  }

  /**
   * Build folder structure recursively
   * @param {string} absolutePath - Absolute path for file operations
   * @param {string} relativePath - Relative path for output
   * @returns {import('../types').IManualTestFolder} Folder structure
   */
  buildFolderStructure(absolutePath, relativePath) {
    const folderName = path.basename(absolutePath);
    const items = fs.readdirSync(absolutePath);

    /**
     * @type {import('../types').IManualTestFolder}
     */
    const structure = {
      name: folderName,
      path: relativePath,
      test_suites: [],
      folders: []
    };

    for (const item of items) {
      const itemPath = path.join(absolutePath, item);
      const itemRelativePath = path.join(relativePath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        // Recursively process subdirectories
        const subFolder = this.buildFolderStructure(itemPath, itemRelativePath);
        structure.folders.push(subFolder);
      } else if (this.isGherkinFile(item)) {
        // Parse gherkin files
        try {
          const testSuite = this.parseGherkinFile(itemPath, itemRelativePath);
          testSuite.hash = this.hashTestSuite(testSuite);
          structure.test_suites.push(testSuite);
        } catch (error) {
          logger.warn(`Warning: Failed to parse ${itemPath}: ${error.message}`);
        }
      }
    }
    structure.hash = this.hashFolder(structure);
    if (structure.test_suites.length > 0) {
      const defaultFolder = {
        name: 'default',
        path: 'default',
        hash: '',
        test_suites: structure.test_suites,
        folders: []
      };
      defaultFolder.hash = this.hashFolder(defaultFolder);
      structure.folders.push(defaultFolder);
      structure.test_suites = [];
    }

    return structure;
  }

  /**
   * Check if file is a gherkin file
   * @param {string} filename - Filename to check
   * @returns {boolean} True if gherkin file
   */
  isGherkinFile(filename) {
    return filename.endsWith('.feature');
  }

  /**
   * Parse a gherkin file and format output
   * @param {string} filePath - Path to gherkin file
   * @param {string} relativePath - Relative path for output
   * @returns {import('../types').IManualTestSuite} Formatted test suite
   */
  parseGherkinFile(filePath, relativePath) {
    const parsed = this.parser.parse(filePath);

    return {
      name: parsed.name,
      type: parsed.type,
      tags: parsed.tags,
      before_each: parsed.before_each,
      path: relativePath,
      test_cases: parsed.test_cases || [] // Map 'cases' to 'test_cases' for consistency
    };
  }
}

module.exports = { ManualSyncHelper };
