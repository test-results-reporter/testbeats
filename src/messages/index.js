const teams = require('./teams');

function getPayload(testResults, opts) {
  teams.getTestSummaryMessage(testResults, opts);
}

module.exports = {
  getPayload
}