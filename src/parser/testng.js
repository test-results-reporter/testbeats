const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');

function getTestResult(filePath) {
  const json = getJsonFromXMLFile(filePath);
  const result = new TestResult();
  const results = json['testng-results'];
  result.failed = parseInt(results.failed);
  result.passed = parseInt(results.passed);
  result.total = parseInt(results.total);
  if (results.ignored) {
    result.total = result.total - parseInt(results.ignored);
  }
  const suite = json['testng-results'].children[1].suite;
  result.name = suite.name;
  result.duration = suite['duration-ms'];
  return result;
}


module.exports = {
  getTestResult
}