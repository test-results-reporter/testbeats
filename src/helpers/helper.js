const fs = require('fs');
const path = require('path');
const { convertXML } = require('simple-xml-to-json');

function getText(text) {
  if (text.startsWith('{') && text.endsWith('}')) {
    const content = text.substring(1, text.length - 1);
    return process.env[content];
  }
  return text;
}

function getJsonFromXMLFile(filePath) {
  const cwd = process.cwd();
  const xml = fs.readFileSync(path.join(cwd, filePath)).toString();
  return convertXML(xml);
}

function getPercentage(x, y) {
  if (y > 0) {
    return Math.round((x / y) * 100);
  }
  return 0;
}

module.exports = {
  getText,
  getJsonFromXMLFile,
  getPercentage
}