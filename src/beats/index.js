const TestResult = require('test-results-parser/src/models/TestResult');
const { Beats } = require('./beats');
const logger = require('../utils/logger');

/**
 * @param {import('../index').PublishReport} config
 * @param {TestResult} result
 */
async function run(config, result) {
  const beats = new Beats(config, result);
  await beats.publish();
}

module.exports = { run }