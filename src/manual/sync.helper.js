const fs = require('fs');
const path = require('path');
const { GherkinParser } = require('./parsers/gherkin');

class ManualSyncHelper {
  constructor() {
    this.parser = new GherkinParser();
  }

  /**
   * Scan directory recursively and build folder structure
   * @param {string} directoryPath - Path to scan
   * @returns {Object} Folder structure with test suites
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
   * @returns {Object} Folder structure
   */
  buildFolderStructure(absolutePath, relativePath) {
    const folderName = path.basename(absolutePath);
    const items = fs.readdirSync(absolutePath);

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
          structure.test_suites.push(testSuite);
        } catch (error) {
          console.warn(`Warning: Failed to parse ${itemPath}: ${error.message}`);
        }
      }
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
   * @returns {Object} Formatted test suite
   */
  parseGherkinFile(filePath, relativePath) {
    const parsed = this.parser.parse(filePath);

    return {
      name: parsed.name,
      type: parsed.type,
      tags: parsed.tags,
      beforeEach: parsed.beforeEach,
      path: relativePath,
      test_cases: parsed.cases || [] // Map 'cases' to 'test_cases' for consistency
    };
  }
}

module.exports = { ManualSyncHelper };
