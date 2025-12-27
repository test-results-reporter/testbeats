class ManualTestComparator {
  /**
   * @param {import('../beats/beats.api').BeatsApi} beatsApi
   */
  constructor(beatsApi) {
    this.beatsApi = beatsApi;
  }

  /**
   * Compare local structure with server
   * @param {import('../types').IManualTestFolder} structure - Local folder structure
   * @param {string} projectId - Project ID
   * @returns {Promise<import('../types').IManualSyncCompareResponse>} Comparison result
   * @throws {Error} If comparison fails
   */
  async compare(structure, projectId) {
    try {
      const payload = this.#buildPayload(structure, projectId);
      const response = await this.beatsApi.compareManualTests(payload);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Build the payload for the compare manual tests API
   * @param {import('../types').IManualTestFolder} structure
   * @param {string} projectId
   * @returns {import('../types').IManualSyncComparePayload}
   */
  #buildPayload(structure, projectId) {
    const payload = {
      project_id: projectId,
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

module.exports = { ManualTestComparator };

