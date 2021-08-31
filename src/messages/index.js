const teams = require('./teams');

function getPayload(testResults, opts) {
  return teams.getTestSummaryMessage(testResults, opts);
}

module.exports = {
  getPayload
}