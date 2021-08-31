const fs = require('fs');
const path = require('path');
const { convertXML } = require('simple-xml-to-json');

const TestResult = require('../models/TestResult');

function getTestResult(filePath) {
  const cwd = process.cwd();
  const xml = fs.readFileSync(path.join(cwd, filePath)).toString();
  const json = convertXML(xml);
  const result = new TestResult();
  const results = json['testng-results'];
  result.failed = parseInt(results.failed);
  result.passed = parseInt(results.passed);
  result.total = parseInt(results.total);
  return result;
}


module.exports = {
  getTestResult
}