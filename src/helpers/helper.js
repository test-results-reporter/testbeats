const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');

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
  return parser.parse(xml, { arrayMode: true, ignoreAttributes: false, parseAttributeValue: true });
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