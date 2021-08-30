const junit = require('./junit');

function parse(opts) {
  return junit.getTestResult(opts.files[0]);
}

module.exports = {
  parse
}