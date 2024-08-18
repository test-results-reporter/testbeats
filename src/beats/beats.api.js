const request = require('phin-retry');

class BeatsApi {

  /**
   * @param {import('../index').PublishReport} config
   */
  constructor(config) {
    this.config = config;
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
}

module.exports = { BeatsApi }