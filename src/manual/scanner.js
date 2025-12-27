const path = require('path');
const logger = require('../utils/logger');

const DEFAULT_FOLDER_NAME = 'default';

/**
 * Scans directories for manual test cases and builds folder structures
 */
class ManualTestScanner {
  constructor(fs, parser) {
    /**
     * @type {import('fs')}
     */
    this.fs = fs;
    /**
     * @type {import('./parsers/gherkin').GherkinParser}
     */
    this.parser = parser;
  }

  /**
   * Scan directory recursively and build folder structure
   * @param {string} directoryPath - Path to scan
   * @returns {Promise<import('../types').IManualTestFolder>} Folder structure with test suites and hashes
   * @throws {Error} If directory doesn't exist or is not a directory
   */
  async scanDirectory(directoryPath) {
    const absolutePath = path.resolve(directoryPath);

    if (!this.fs.existsSync(absolutePath)) {
      throw new Error(`Directory ${directoryPath} does not exist`);
    }

    if (!this.fs.statSync(absolutePath).isDirectory()) {
      throw new Error(`Path ${directoryPath} is not a directory`);
    }

    const structure = this.buildFolderStructure(absolutePath, directoryPath);
    this.moveTestSuitesToDefaultFolder(structure);
    return structure;
  }

  /**
   * Build folder structure recursively
   * @param {string} absolutePath - Absolute path for file operations
   * @param {string} relativePath - Relative path for output
   * @returns {import('../types').IManualTestFolder} Folder structure
   */
  buildFolderStructure(absolutePath, relativePath) {
    const folderName = path.basename(absolutePath);
    const items = this.fs.readdirSync(absolutePath);

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
      const stats = this.fs.statSync(itemPath);

      if (stats.isDirectory()) {
        // Recursively process subdirectories
        const subFolder = this.buildFolderStructure(itemPath, itemRelativePath);
        structure.folders.push(subFolder);
      } else if (this.isGherkinFile(item)) {
        // Parse gherkin files
        try {
          const testSuite = this.parseGherkinFile(itemPath, itemRelativePath);
          structure.test_suites.push(testSuite);
        } catch (error) {
          logger.warn(`Warning: Failed to parse ${itemPath}: ${error.message}`);
        }
      }
    }

    return structure;
  }

  moveTestSuitesToDefaultFolder(structure) {
    if (structure.test_suites.length > 0) {
      const defaultFolder = {
        name: DEFAULT_FOLDER_NAME,
        path: DEFAULT_FOLDER_NAME,
        test_suites: structure.test_suites,
        folders: []
      };
      structure.folders.push(defaultFolder);
      structure.test_suites = [];
    }
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
      test_cases: parsed.test_cases || []
    };
  }
}

module.exports = { ManualTestScanner };

