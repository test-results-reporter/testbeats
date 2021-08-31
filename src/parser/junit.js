const fs = require('fs');
const path = require('path');
const { convertXML } = require('simple-xml-to-json');

const TestResult = require('../models/TestResult');

function getTestResult(filePath) {
  const cwd = process.cwd();
  const xml = fs.readFileSync(path.join(cwd, filePath)).toString();
  const json = convertXML(xml);
  const result = new TestResult();
  const suites = json.testsuites;
  result.name = suites.name;
  result.failed = parseInt(suites.failures);
  result.passed = parseInt(suites.tests);
  result.errors = suites.errors ? parseInt(suites.errors) : result.errors;
  result.total = result.passed + result.failed + result.errors;
  result.duration = suites.time;
  return result;
}


module.exports = {
  getTestResult
}