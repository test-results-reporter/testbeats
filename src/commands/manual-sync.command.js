const path = require('path');
const { ManualSyncHelper } = require('../manual/sync.helper');
const logger = require('../utils/logger');

class ManualSyncCommand {
  /**
   * @param {Object} opts - Command options
   */
  constructor(opts) {
    this.opts = opts;
    this.syncHelper = new ManualSyncHelper();
  }

  /**
   * Execute the manual sync command
   */
  async execute() {
    try {
      logger.info('🔄 Starting manual test case sync...');

      const targetPath = this.opts.path || '.';
      logger.info(`📁 Scanning directory: ${targetPath}`);

      const result = await this.syncHelper.scanDirectory(targetPath);

      // Format output as specified in requirements
      const output = {
        folders: [result]
      };

      // Display results
      this.displayResults(output);

      logger.info('✅ Manual sync completed successfully!');

      return output;

    } catch (error) {
      logger.error(`❌ Manual sync failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Display sync results in a readable format
   * @param {Object} output - Sync results
   */
  displayResults(output) {
    logger.info('\n📊 Sync Results:');
    this.displayFolderRecursive(output.folders[0], 0);
  }

  /**
   * Recursively display folder structure
   * @param {Object} folder - Folder object
   * @param {number} depth - Current depth for indentation
   */
  displayFolderRecursive(folder, depth) {
    const indent = '  '.repeat(depth);

    logger.info(`${indent}📁 ${folder.name} (${folder.path})`);

    if (folder.test_suites.length > 0) {
      logger.info(`${indent}  📋 Test Suites: ${folder.test_suites.length}`);
      folder.test_suites.forEach(suite => {
        logger.info(`${indent}    • ${suite.name} (${suite.test_cases.length} test cases)`);
      });
    }

    if (folder.folders.length > 0) {
      logger.info(`${indent}  📂 Subfolders: ${folder.folders.length}`);
      folder.folders.forEach(subFolder => {
        this.displayFolderRecursive(subFolder, depth + 1);
      });
    }
  }
}

module.exports = { ManualSyncCommand };
