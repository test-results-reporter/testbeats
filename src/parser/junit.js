const fs = require('fs');
const { convertXML } = require('simple-xml-to-json');

const TestResult = require('../models/TestResult');

function getTestResult(path) {
  const cwd = process.cwd();
  const xml = fs.readFileSync(path.join(cwd, path)).toString();
  const json = convertXML(xml);
  const result = new TestResult();
  const suites = json.testsuites;
  result.name = suites.name;
  result.failed = parseInt(suites.failures);
  result.passed = parseInt(suites.tests);
  result.errors = parseInt(suites.errors);
  result.total = result.passed + result.failed + result.errors;
  result.duration = suites.time;
  return result;
}


module.exports = {
  getTestResult
}