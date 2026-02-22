const request = require('phin-retry');

class BeatsApi {

  /**
   * @param {import('../index').PublishReport} config
   */
  constructor(config) {
    this.config = config;
  }

  searchProjects(search_text) {
    return request.get({
      url: `${this.getBaseUrl()}/api/core/v1/projects?search_text=${search_text}`,
      headers: {
        'x-api-key': this.config.api_key
      }
    });
  }

  postTestRun(payload) {
    return request.post({
      url: `${this.getBaseUrl()}/api/core/v1/test-runs`,
      headers: {
        'x-api-key': this.config.api_key
      },
      body: payload
    });
  }

 /**
  * @param {string} run_id
  * @returns
  */
  getTestRun(run_id) {
    return request.get({
      url: `${this.getBaseUrl()}/api/core/v1/test-runs/${run_id}`,
      headers: {
        'x-api-key': this.config.api_key
      }
    });
  }

  uploadAttachments(headers, payload) {
    return request.post({
      url: `${this.getBaseUrl()}/api/core/v1/test-cases/attachments`,
      headers: {
        'x-api-key': this.config.api_key,
        ...headers
      },
      body: payload
    });
  }

  getBaseUrl() {
    return process.env.TEST_BEATS_URL || "https://app.testbeats.com";
  }

  /**
   *
   * @param {string} run_id
   * @param {number} limit
   * @returns {import('./beats.types').IErrorClustersResponse}
   */
  getErrorClusters(run_id, limit = 3) {
    return request.get({
      url: `${this.getBaseUrl()}/api/core/v1/test-runs/${run_id}/error-clusters?limit=${limit}`,
      headers: {
        'x-api-key': this.config.api_key
      }
    });
  }


  /**
   * @param {string} run_id
   * @returns {import('./beats.types').IFailureSignature[]}
   */
  getFailureSignatures(run_id) {
    return request.get({
      url: `${this.getBaseUrl()}/api/core/v1/automation/test-run-executions/${run_id}/failure-signatures`,
      headers: {
        'x-api-key': this.config.api_key
      }
    });
  }

  /**
   *
   * @param {string} run_id
   * @returns {import('./beats.types').IFailureAnalysisMetric[]}
   */
  getFailureAnalysis(run_id) {
    return request.get({
      url: `${this.getBaseUrl()}/api/core/v1/test-runs/${run_id}/failure-analysis`,
      headers: {
        'x-api-key': this.config.api_key
      }
    });
  }

  /**
   * @param {import('../types').IManualSyncComparePayload} payload
   * @returns {Promise<import('../types').IManualSyncCompareResponse>}
   */
  compareManualTests(payload) {
    return request.post({
      url: `${this.getBaseUrl()}/api/core/v1/manual/sync/compare`,
      headers: {
        'x-api-key': this.config.api_key
      },
      body: payload
    });
  }

  syncManualFolders(payload) {
    return request.post({
      url: `${this.getBaseUrl()}/api/core/v1/manual/sync/folders`,
      headers: {
        'x-api-key': this.config.api_key
      },
      body: payload
    });
  }

  syncManualTestSuites(payload) {
    return request.post({
      url: `${this.getBaseUrl()}/api/core/v1/manual/sync/suites`,
      headers: {
        'x-api-key': this.config.api_key
      },
      body: payload
    });
  }
}

module.exports = { BeatsApi }