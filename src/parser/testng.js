const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');

function getTestSuite(rawSuite) {
  const suite = new TestSuite();
  suite.name = rawSuite['@_name'];
  suite.duration = rawSuite['@_duration-ms'];
  const rawTests = [];
  const rawClasses = rawSuite.class;
  for (let i = 0; i < rawClasses.length; i++) {
    rawTests.push(...rawClasses[i]['test-method'].filter(raw => !raw['@_is-config']));
  }
  suite.total = rawTests.length;
  suite.passed = rawTests.filter(test => test['@_status'] === 'PASS').length;
  suite.failed = rawTests.filter(test => test['@_status'] === 'FAIL').length;
  return suite;
}

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
  const rawSuites = suite.test;
  for (let i = 0; i < rawSuites.length; i++) {
    result.suites.push(getTestSuite(rawSuites[i]));
  }
  result.status = result.total === result.passed ? 'PASS' : 'FAIL';
  return result;
}


module.exports = {
  getTestResult
}