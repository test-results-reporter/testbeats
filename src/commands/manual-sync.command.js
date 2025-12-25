const { ManualSyncHelper } = require('../manual/sync.helper');
const logger = require('../utils/logger');
const { BeatsApi } = require('../beats/beats.api');
const { BaseCommand } = require('./base.command');

class ManualSyncCommand extends BaseCommand {
  /**
   * @param {Object} opts - Command options
   */
  constructor(opts) {
    super(opts);
    this.syncHelper = new ManualSyncHelper();
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
      logger.info(`📁 Scanning directory: ${targetPath}`);

      const result = await this.syncHelper.scanDirectory(targetPath);

      const counts = this.getCounts(result);
      logger.info(`📊 Found ${counts.totalTestCases} test cases, ${counts.totalTestSuites} test suites, and ${counts.totalFolders} folders`);

      // Format output as specified in requirements
      const output = {
        folders: result.folders
      };



      const beats = new BeatsApi(this.opts.config);
      const projectsResponse = await beats.searchProjects(this.opts.config.project);
      const project = projectsResponse.values.find(p => p.name === this.opts.config.project);
      if (!project) {
        throw new Error(`Project ${this.opts.config.project} not found`);
      }
      this.opts.config.project = project.id;

      const compare = new ManualSyncCompare(this.opts.config);
      const compareResult = await compare.compare(output);

      const resources = new ManualSyncResources(this.opts.config);
      await resources.sync(output, compareResult);

    } catch (error) {
      logger.error(`❌ Manual sync failed: ${error.message}`);
      throw error;
    }
  }

  getCounts(result, counts = { totalTestCases: 0, totalTestSuites: 0, totalFolders: 0 }) {
    // return the total number of test cases, test suites, and folders
    for (const folder of result.folders) {
      counts.totalTestCases += folder.test_suites.reduce((acc, suite) => acc + suite.test_cases.length, 0);
      counts.totalTestSuites += folder.test_suites.length;
      counts.totalFolders += folder.folders.length;
      this.getCounts(folder, counts);
    }
    return counts;
  }
}

class ManualSyncCompare {

  constructor(config) {
    this.config = config;
    this.beats = new BeatsApi(this.config);
  }

  /**
   * @param {import('../types').IManualTestFolder} structure
   */
  async compare(structure) {
    const payload = this.#buildPayload(structure);
    const response = await this.beats.compareManualTests(payload);
    return response;
  }


  /**
   * Build the payload for the compare manual tests API
   * @param {import('../types').IManualTestFolder} structure
   * @returns {import('../types').IManualSyncComparePayload}
   */
  #buildPayload(structure) {
    const payload = {
      project_id: this.config.project,
      folders: [],
    };
    for (const folder of structure.folders) {
      payload.folders.push(this.#buildPayloadFolder(folder));
    }
    return payload;
  }

  /**
   * Build the payload for a folder
   * @param {import('../types').IManualTestFolder} folder
   * @returns {import('../types').IManualSyncCompareFolder}
   */
  #buildPayloadFolder(folder) {
    return {
      name: folder.name,
      hash: folder.hash,
      test_suites: folder.test_suites.map(testSuite => this.#buildPayloadTestSuite(testSuite)),
      folders: folder.folders.map(subFolder => this.#buildPayloadFolder(subFolder))
    };
  }

  /**
   * Build the payload for a test suite
   * @param {import('../types').IManualTestSuite} testSuite
   * @returns {import('../types').IManualSyncCompareTestSuite}
   */
  #buildPayloadTestSuite(testSuite) {
    return {
      name: testSuite.name,
      hash: testSuite.hash,
    };
  }
}

class ManualSyncResources {
  constructor(config) {
    this.config = config;
    this.beats = new BeatsApi(this.config);
  }

  /**
   * Sync the manual resources
   * @param {import('../types').IManualTestFolder} structure
   * @param {import('../types').IManualSyncCompareResponse} compareResult
   */
  async sync(structure, compareResult) {
    this.#mergeStructure(structure, compareResult);
    await this.#syncFolders(structure.folders);
  }

  /**
   * Merge the structure with the compare result
   * @param {import('../types').IManualTestFolder} structure
   * @param {import('../types').IManualSyncCompareResponse} compareResult
   */
  #mergeStructure(structure, compareResult) {
    // Iterate through all folders from compare result and merge with local structure
    for (const serverFolder of compareResult.folders) {
      const localFolder = structure.folders.find(f => f.name === serverFolder.name);
      if (localFolder) {
        this.#mergeFolder(localFolder, serverFolder);
      } else {
        structure.folders.push(this.#convertServerFolderToLocal(serverFolder));
      }
    }
  }

  /**
   * Merge server folder metadata into local folder
   * @param {import('../types').IManualTestFolder} localFolder - Local folder with full data
   * @param {import('../types').IManualSyncCompareResponseFolder} serverFolder - Server folder with metadata
   */
  #mergeFolder(localFolder, serverFolder) {
    // Enrich local folder with server metadata
    localFolder.id = serverFolder.id;
    localFolder.type = serverFolder.type;

    // Ensure server folder has test suites and folders
    serverFolder.test_suites = serverFolder.test_suites || [];
    serverFolder.folders = serverFolder.folders || [];

    for (const serverSuite of serverFolder.test_suites) {
      const localSuite = localFolder.test_suites.find(s => s.name === serverSuite.name);
      if (localSuite) {
        this.#mergeTestSuite(localSuite, serverSuite);
      } else {
        localFolder.test_suites.push(this.#convertServerSuiteToLocal(serverSuite));
      }
    }

    for (const serverSubFolder of serverFolder.folders) {
      const localSubFolder = localFolder.folders.find(f => f.name === serverSubFolder.name);
      if (localSubFolder) {
        this.#mergeFolder(localSubFolder, serverSubFolder);
      } else {
        localFolder.folders.push(this.#convertServerFolderToLocal(serverSubFolder));
      }
    }
  }

  /**
   * Merge server test suite metadata into local test suite
   * @param {import('../types').IManualTestSuite} localSuite - Local test suite with full data
   * @param {import('../types').IManualSyncCompareResponseTestSuite} serverSuite - Server suite with metadata
   */
  #mergeTestSuite(localSuite, serverSuite) {
    localSuite.id = serverSuite.id;
    localSuite.type = serverSuite.type;
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

  async #syncFolders(folders) {
    const payload = {
      project_id: this.config.project,
      folders: folders.map(folder => ({
        type: folder.type,
        id: folder.id,
        name: folder.name,
        hash: folder.hash,
        parent_folder_id: folder.parent_folder_id,
      })),
    };
    const response = await this.beats.syncManualFolders(payload);
    const results = response.results;
    for (const result of results) {
      if (result.success) {
        logger.info(`✅ Folder '${result.name}' synced successfully`);
        const folder = folders.find(f => f.name === result.name);
        if (!folder) {
          logger.error(`❌ Folder ${result.name} not found in local structure`);
          continue;
        }
        folder.id = folder.id || result.id;
        for (const testSuite of folder.test_suites) {
          testSuite.folder_id = folder.id;
        }
        await this.#syncTestSuites(folder.test_suites);
        for (const subFolder of folder.folders) {
          subFolder.parent_folder_id = folder.id;
        }
        await this.#syncFolders(folder.folders);
      }
    }
  }

  async #syncTestSuites(testSuites) {
    const payload = {
      project_id: this.config.project,
      suites: testSuites.map(testSuite => ({
        type: testSuite.type,
        name: testSuite.name,
        folder_id: testSuite.folder_id,
        hash: testSuite.hash,
        tags: testSuite.tags,
        before_each: testSuite.before_each.map(step => step.name),
        test_cases: testSuite.test_cases.map(tc => {
          return {
            name: tc.name,
            type: tc.type,
            tags: tc.tags,
            steps: tc.steps.map(step => step.name),
            hash: tc.hash,
          };
        }),
      })),
    };
    const response = await this.beats.syncManualTestSuites(payload);
    const results = response.results;
    for (const result of results) {
      if (result.success) {
        logger.info(`✅ Test Suite '${result.name}' synced successfully`);
      } else {
        logger.error(`❌ Test Suite '${result.name}' failed to sync: ${result.error}`);
      }
    }
  }

}

module.exports = { ManualSyncCommand, ManualSyncCompare };
