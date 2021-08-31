const testng = require('./testng');

function parse(opts) {
  return testng.getTestResult(opts.files[0]);
}

module.exports = {
  parse
}