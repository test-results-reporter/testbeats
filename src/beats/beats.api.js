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
      url: `${this.getBaseUrl()}/api/core/v1/test-runs/key?id=${run_id}`,
      headers: {
        'x-api-key': this.config.api_key
      }
    });
  }

  getBaseUrl() {
    return process.env.TEST_BEATS_URL || "https://app.testbeats.com";
  }
}

module.exports = { BeatsApi }