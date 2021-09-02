const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');

function getTestResult(filePath) {
  const json = getJsonFromXMLFile(filePath);
  const result = new TestResult();
  const results = json['testng-results'][0];
  result.failed = results['@_failed'];
  result.passed = results['@_passed'];
  result.total = results['@_total'];
  const ignored = results['@_ignored'];
  if (ignored) {
    result.total = result.total - ignored;
  }
  const suite = results.suite[0];
  result.name = suite['@_name'];
  result.duration = suite['@_duration-ms'];
  return result;
}


module.exports = {
  getTestResult
}