const fs = require('fs');
const { BeatsApi } = require('../beats/beats.api');
const { ManualTestScanner } = require('./scanner');
const { ManualTestComparator } = require('./comparator');
const { ManualTestSynchronizer } = require('./synchronizer');
const { ProjectResolver } = require('./project-resolver');
const { ManualSyncOrchestrator } = require('./orchestrator');
const { ManualTestHasher } = require('./hasher');
const { GherkinParser } = require('./parsers/gherkin');

/**
 * Factory for creating properly wired manual sync services
 * Implements dependency injection and ensures single BeatsApi instance
 */
class ManualSyncServiceFactory {
  /**
   * Create a fully configured orchestrator with all dependencies
   * @param {Object} config - Configuration object for BeatsApi
   * @returns {ManualSyncOrchestrator} Configured orchestrator
   */
  static create(config) {
    const beatsApi = new BeatsApi(config);
    const hasher = new ManualTestHasher();
    const parser = new GherkinParser(fs);
    const scanner = new ManualTestScanner(fs, parser);
    const comparator = new ManualTestComparator(beatsApi);
    const synchronizer = new ManualTestSynchronizer(beatsApi);
    const projectResolver = new ProjectResolver(beatsApi);

    return new ManualSyncOrchestrator(
      scanner,
      comparator,
      synchronizer,
      projectResolver,
      hasher
    );
  }

  /**
   * Create individual services for testing or custom workflows
   * @param {Object} config - Configuration object for BeatsApi
   * @returns {Object} Object containing all services
   */
  static createServices(config) {
    const beatsApi = new BeatsApi(config);
    const hasher = new ManualTestHasher();

    return {
      beatsApi,
      hasher,
      scanner: new ManualTestScanner(),
      comparator: new ManualTestComparator(beatsApi),
      synchronizer: new ManualTestSynchronizer(beatsApi),
      projectResolver: new ProjectResolver(beatsApi)
    };
  }
}

module.exports = { ManualSyncServiceFactory };

