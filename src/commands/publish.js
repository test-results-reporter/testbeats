const path = require('path')
async function run(opts) {
  const cwd = process.cwd();
  const config = require(path.join(cwd, opts.config));
  const { convertXML } = require('simple-xml-to-json');
  const fs = require('fs');
  const xml = fs.readFileSync(path.join(cwd, config.reports[0].resultFiles[0])).toString();
  const json = convertXML(xml);
  console.log(json)
}

module.exports = {
  run
}