const logger = require('../utils/logger');

/**
 * Orchestrates the manual sync pipeline
 * Implements the Template Method pattern to coordinate the sync workflow
 */
class ManualSyncOrchestrator {
  /**
   * @param {import('./scanner').ManualTestScanner} scanner
   * @param {import('./comparator').ManualTestComparator} comparator
   * @param {import('./synchronizer').ManualTestSynchronizer} synchronizer
   * @param {import('./project-resolver').ProjectResolver} projectResolver
   * @param {import('./hasher').ManualTestHasher} hasher
   */
  constructor(scanner, comparator, synchronizer, projectResolver, hasher) {
    this.scanner = scanner;
    this.comparator = comparator;
    this.synchronizer = synchronizer;
    this.projectResolver = projectResolver;
    this.hasher = hasher;
  }

  /**
   * Execute the complete manual sync pipeline
   * @param {string} directoryPath - Path to scan for manual tests
   * @param {string} projectName - Project name to sync to
   * @returns {Promise<Object>} Sync result with statistics and errors
   */
  async execute(directoryPath, projectName) {
    const result = {
      success: false,
      projectId: null,
      statistics: {
        totalTestCases: 0,
        totalTestSuites: 0,
        totalFolders: 0,
        foldersProcessed: 0,
        testSuitesProcessed: 0
      },
      errors: []
    };

    try {
      // Step 1: Resolve project
      logger.info(`📋 Resolving project: ${projectName}`);
      result.projectId = await this.projectResolver.resolveProject(projectName);
      logger.info(`✅ Project resolved: ${result.projectId}`);

      // Step 2: Scan directory
      logger.info(`📁 Scanning directory: ${directoryPath}`);
      const scannedStructure = await this.scanner.scanDirectory(directoryPath);

      // Step 2.5: Add hashes to scanned structure
      logger.debug('🔐 Adding hashes to structure...');
      this.hasher.hashStructure(scannedStructure);

      // Calculate statistics from scanned structure
      const stats = this.#calculateStatistics(scannedStructure);
      result.statistics.totalTestCases = stats.totalTestCases;
      result.statistics.totalTestSuites = stats.totalTestSuites;
      result.statistics.totalFolders = stats.totalFolders;

      logger.info(`📊 Found ${stats.totalTestCases} test cases, ${stats.totalTestSuites} test suites, and ${stats.totalFolders} folders`);

      // Step 3: Compare with server
      logger.info('🔍 Comparing with server...');
      const comparisonResult = await this.comparator.compare(scannedStructure, result.projectId);
      logger.info('✅ Comparison completed');

      // Step 4: Synchronize
      logger.info('🔄 Synchronizing resources...');
      const syncResult = await this.synchronizer.sync(scannedStructure, comparisonResult, result.projectId);

      result.statistics.foldersProcessed = syncResult.foldersProcessed;
      result.statistics.testSuitesProcessed = syncResult.testSuitesProcessed;
      result.errors = syncResult.errors;
      result.success = syncResult.success;

      if (result.success) {
        logger.info('✅ Synchronization completed successfully');
      } else {
        logger.warn(`⚠️ Synchronization completed with ${result.errors.length} error(s)`);
      }

      return result;
    } catch (error) {
      logger.error(`❌ Manual sync failed: ${error.message}`);
      result.errors.push({
        type: 'pipeline',
        name: 'execution',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Calculate statistics from scanned structure
   * @param {import('../types').IManualTestFolder} structure
   * @returns {{totalTestCases: number, totalTestSuites: number, totalFolders: number}}
   */
  #calculateStatistics(structure) {
    const stats = {
      totalTestCases: 0,
      totalTestSuites: 0,
      totalFolders: 0
    };

    const processFolder = (folder) => {
      // Count test cases in this folder
      for (const suite of folder.test_suites) {
        stats.totalTestCases += suite.test_cases.length;
        stats.totalTestSuites++;
      }

      // Count subfolders and process recursively
      stats.totalFolders += folder.folders.length;
      for (const subFolder of folder.folders) {
        processFolder(subFolder);
      }
    };

    // Process all folders in the structure
    for (const folder of structure.folders) {
      processFolder(folder);
    }

    return stats;
  }
}

module.exports = { ManualSyncOrchestrator };

