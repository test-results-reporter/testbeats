const { ManualSyncServiceFactory } = require('../manual');
const logger = require('../utils/logger');
const { BaseCommand } = require('./base.command');

class ManualSyncCommand extends BaseCommand {
  /**
   * @param {Object} opts - Command options
   */
  constructor(opts) {
    super(opts);
  }

  /**
   * Execute the manual sync command
   */
  async execute() {
    try {
      this.printBanner();
      this.validateEnvDetails();
      this.buildConfig();

      logger.info('🔄 Starting manual test case sync...');

      const targetPath = this.opts.path || '.';
      const projectName = this.opts.config.project;

      // Create orchestrator with all dependencies wired
      const orchestrator = ManualSyncServiceFactory.create(this.opts.config);

      // Execute the complete pipeline
      const result = await orchestrator.execute(targetPath, projectName);

      // Log final results
      this.#logResults(result);

      return result;
    } catch (error) {
      logger.error(`❌ Manual sync failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Log the final sync results
   * @param {Object} result - Sync result from orchestrator
   */
  #logResults(result) {
    logger.info('');
    logger.info('📊 Sync Summary:');
    logger.info(`   • Test Cases Found: ${result.statistics.totalTestCases}`);
    logger.info(`   • Test Suites Found: ${result.statistics.totalTestSuites}`);
    logger.info(`   • Folders Found: ${result.statistics.totalFolders}`);
    logger.info(`   • Folders Synced: ${result.statistics.foldersProcessed}`);
    logger.info(`   • Test Suites Synced: ${result.statistics.testSuitesProcessed}`);

    if (result.errors.length > 0) {
      logger.info('');
      logger.warn(`⚠️ Encountered ${result.errors.length} error(s):`);
      for (const error of result.errors) {
        logger.warn(`   • [${error.type}] ${error.name}: ${error.error}`);
      }
    }

    if (result.success) {
      logger.info('');
      logger.info('✅ Manual sync completed successfully!');
    } else {
      logger.info('');
      logger.warn('⚠️ Manual sync completed with errors');
    }
  }
}

module.exports = { ManualSyncCommand };
