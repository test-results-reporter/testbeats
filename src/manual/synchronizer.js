const logger = require('../utils/logger');

/**
 * Result of a synchronization operation
 * @typedef {Object} SyncResult
 * @property {boolean} success - Overall success status
 * @property {number} foldersProcessed - Number of folders processed
 * @property {number} testSuitesProcessed - Number of test suites processed
 * @property {Array<{type: string, name: string, error: string}>} errors - List of errors encountered
 */

/**
 * Synchronizes manual test resources with the server
 */
class ManualTestSynchronizer {
  /**
   * @param {import('../beats/beats.api').BeatsApi} beatsApi
   */
  constructor(beatsApi) {
    this.beatsApi = beatsApi;
  }

  /**
   * Sync the manual resources
   * @param {import('../types').IManualTestFolder} structure - Local folder structure
   * @param {import('../types').IManualSyncCompareResponse} compareResult - Comparison result from server
   * @param {string} projectId - Project ID
   * @returns {Promise<SyncResult>} Synchronization result
   */
  async sync(structure, compareResult, projectId) {
    const errors = [];
    let foldersProcessed = 0;
    let testSuitesProcessed = 0;

    const enrichedStructure = this.#mergeStructure(structure, compareResult);
    const syncResult = await this.#syncFolders(enrichedStructure.folders, projectId, errors);
    foldersProcessed = syncResult.foldersProcessed;
    testSuitesProcessed = syncResult.testSuitesProcessed;

    return {
      success: errors.length === 0,
      foldersProcessed,
      testSuitesProcessed,
      errors
    };
  }

  /**
   * Merge the structure with the compare result (returns new structure)
   * @param {import('../types').IManualTestFolder} structure
   * @param {import('../types').IManualSyncCompareResponse} compareResult
   * @returns {import('../types').IManualTestFolder} Enriched structure
   */
  #mergeStructure(structure, compareResult) {
    const enrichedFolders = [];

    for (const localFolder of structure.folders) {
      const serverFolder = compareResult.folders.find(f => f.name === localFolder.name);
      if (serverFolder) {
        enrichedFolders.push(this.#mergeFolder(localFolder, serverFolder));
      } else {
        enrichedFolders.push(localFolder);
      }
    }

    for (const serverFolder of compareResult.folders) {
      const localFolder = structure.folders.find(f => f.name === serverFolder.name);
      if (!localFolder) {
        enrichedFolders.push(this.#convertServerFolderToLocal(serverFolder));
      }
    }

    return {
      ...structure,
      folders: enrichedFolders
    };
  }

  /**
   * Merge server folder metadata into local folder (returns new folder)
   * @param {import('../types').IManualTestFolder} localFolder - Local folder with full data
   * @param {import('../types').IManualSyncCompareResponseFolder} serverFolder - Server folder with metadata
   * @returns {import('../types').IManualTestFolder} Merged folder
   */
  #mergeFolder(localFolder, serverFolder) {
    const enrichedTestSuites = [];
    const enrichedSubFolders = [];
    const serverTestSuites = serverFolder.test_suites || [];
    const serverFolders = serverFolder.folders || [];

    for (const localSuite of localFolder.test_suites) {
      const serverSuite = serverTestSuites.find(s => s.name === localSuite.name);
      if (serverSuite) {
        enrichedTestSuites.push(this.#mergeTestSuite(localSuite, serverSuite));
      } else {
        enrichedTestSuites.push(localSuite);
      }
    }

    for (const serverSuite of serverTestSuites) {
      const localSuite = localFolder.test_suites.find(s => s.name === serverSuite.name);
      if (!localSuite) {
        enrichedTestSuites.push(this.#convertServerSuiteToLocal(serverSuite));
      }
    }

    for (const localSubFolder of localFolder.folders) {
      const serverSubFolder = serverFolders.find(f => f.name === localSubFolder.name);
      if (serverSubFolder) {
        enrichedSubFolders.push(this.#mergeFolder(localSubFolder, serverSubFolder));
      } else {
        enrichedSubFolders.push(localSubFolder);
      }
    }

    for (const serverSubFolder of serverFolders) {
      const localSubFolder = localFolder.folders.find(f => f.name === serverSubFolder.name);
      if (!localSubFolder) {
        enrichedSubFolders.push(this.#convertServerFolderToLocal(serverSubFolder));
      }
    }

    return {
      ...localFolder,
      id: serverFolder.id,
      type: serverFolder.type,
      test_suites: enrichedTestSuites,
      folders: enrichedSubFolders
    };
  }

  /**
   * Merge server test suite metadata into local test suite (returns new suite)
   * @param {import('../types').IManualTestSuite} localSuite - Local test suite with full data
   * @param {import('../types').IManualSyncCompareResponseTestSuite} serverSuite - Server suite with metadata
   * @returns {import('../types').IManualTestSuite} Merged test suite
   */
  #mergeTestSuite(localSuite, serverSuite) {
    return {
      ...localSuite,
      id: serverSuite.id,
      type: serverSuite.type
    };
  }

  /**
   * Convert server folder to local folder structure (for delete operations)
   * @param {import('../types').IManualSyncCompareResponseFolder} serverFolder - Server folder
   * @returns {import('../types').IManualTestFolder} Local folder structure
   */
  #convertServerFolderToLocal(serverFolder) {
    return {
      name: serverFolder.name,
      path: '',
      hash: serverFolder.hash,
      id: serverFolder.id,
      type: serverFolder.type,
      test_suites: serverFolder.test_suites?.map(s => this.#convertServerSuiteToLocal(s)) || [],
      folders: serverFolder.folders?.map(f => this.#convertServerFolderToLocal(f)) || []
    };
  }

  /**
   * Convert server test suite to local test suite structure (for delete operations)
   * @param {import('../types').IManualSyncCompareResponseTestSuite} serverSuite - Server suite
   * @returns {import('../types').IManualTestSuite} Local test suite structure
   */
  #convertServerSuiteToLocal(serverSuite) {
    return {
      name: serverSuite.name,
      tags: [],
      before_each: [],
      test_cases: [],
      hash: serverSuite.hash,
      id: serverSuite.id,
      type: serverSuite.type
    };
  }

  /**
   * Sync folders recursively
   * @param {Array<import('../types').IManualTestFolder>} folders
   * @param {string} projectId
   * @param {Array} errors - Array to collect errors
   * @returns {Promise<{foldersProcessed: number, testSuitesProcessed: number}>}
   */
  async #syncFolders(folders, projectId, errors) {
    let foldersProcessed = 0;
    let testSuitesProcessed = 0;

    if (folders.length === 0) {
      return { foldersProcessed, testSuitesProcessed };
    }

    const payload = {
      project_id: projectId,
      folders: folders.map(folder => ({
        type: folder.type,
        id: folder.id,
        name: folder.name,
        hash: folder.hash,
        parent_folder_id: folder.parent_folder_id,
      })),
    };

    try {
      const response = await this.beatsApi.syncManualFolders(payload);
      const results = response.results;

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const folder = folders[i];

        if (result.success) {
          logger.info(`✅ Folder '${result.name}' synced successfully`);
          foldersProcessed++;

          folder.id = folder.id || result.id;

          if (folder.test_suites && folder.test_suites.length > 0) {
            const testSuitesWithFolderId = folder.test_suites.map(ts => ({
              ...ts,
              folder_id: folder.id
            }));

            const suiteResult = await this.#syncTestSuites(testSuitesWithFolderId, projectId, errors);
            testSuitesProcessed += suiteResult.testSuitesProcessed;
          }

          if (folder.folders && folder.folders.length > 0) {
            const subfoldersWithParent = folder.folders.map(sf => ({
              ...sf,
              parent_folder_id: folder.id
            }));

            const subResult = await this.#syncFolders(subfoldersWithParent, projectId, errors);
            foldersProcessed += subResult.foldersProcessed;
            testSuitesProcessed += subResult.testSuitesProcessed;
          }
        } else {
          const error = {
            type: 'folder',
            name: result.name,
            error: result.error || 'Unknown error'
          };
          errors.push(error);
          logger.error(`❌ Folder '${result.name}' failed to sync: ${error.error}`);
        }
      }
    } catch (error) {
      const syncError = {
        type: 'folder_batch',
        name: 'batch',
        error: error.message
      };
      errors.push(syncError);
      logger.error(`❌ Failed to sync folder batch: ${error.message}`);
    }

    return { foldersProcessed, testSuitesProcessed };
  }

  /**
   * Sync test suites
   * @param {Array<import('../types').IManualTestSuite>} testSuites
   * @param {string} projectId
   * @param {Array} errors - Array to collect errors
   * @returns {Promise<{testSuitesProcessed: number}>}
   */
  async #syncTestSuites(testSuites, projectId, errors) {
    let testSuitesProcessed = 0;

    if (testSuites.length === 0) {
      return { testSuitesProcessed };
    }

    const payload = {
      project_id: projectId,
      suites: testSuites.map(testSuite => ({
        type: testSuite.type,
        name: testSuite.name,
        folder_id: testSuite.folder_id,
        hash: testSuite.hash,
        tags: testSuite.tags,
        before_each: testSuite.before_each.map(step => step.name),
        test_cases: testSuite.test_cases.map(tc => ({
          name: tc.name,
          type: tc.type,
          tags: tc.tags,
          steps: tc.steps.map(step => step.name),
          hash: tc.hash,
        })),
      })),
    };

    try {
      const response = await this.beatsApi.syncManualTestSuites(payload);
      const results = response.results;

      for (const result of results) {
        if (result.success) {
          logger.info(`✅ Test Suite '${result.name}' synced successfully`);
          testSuitesProcessed++;
        } else {
          const error = {
            type: 'test_suite',
            name: result.name,
            error: result.error || 'Unknown error'
          };
          errors.push(error);
          logger.error(`❌ Test Suite '${result.name}' failed to sync: ${error.error}`);
        }
      }
    } catch (error) {
      const syncError = {
        type: 'test_suite_batch',
        name: 'batch',
        error: error.message
      };
      errors.push(syncError);
      logger.error(`❌ Failed to sync test suite batch: ${error.message}`);
    }

    return { testSuitesProcessed };
  }
}

module.exports = { ManualTestSynchronizer };

