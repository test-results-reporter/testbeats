const pretty_ms = require('pretty-ms');
const os = require('os');
const semver = require('semver');
const {MIN_NODE_VERSION } = require('./constants');

const DATA_REF_PATTERN = /(\{[^\}]+\})/g;
const ALLOWED_CONDITIONS = new Set(['pass', 'fail', 'passorfail']);
const GENERIC_CONDITIONS = new Set(['always', 'never']);

function getPercentage(x, y) {
  if (y > 0) {
    return Math.floor((x / y) * 100);
  }
  return 0;
}

function processText(raw) {
  const dataRefMatches = raw.match(DATA_REF_PATTERN);
  if (dataRefMatches) {
    const values = [];
    for (let i = 0; i < dataRefMatches.length; i++) {
      const dataRefMatch = dataRefMatches[i];
      const content = dataRefMatch.slice(1, -1);
      if (process.env[content]) {
        values.push(process.env[content]);
      } else {
        values.push(content);
      }
    }
    for (let i = 0; i < dataRefMatches.length; i++) {
      raw = raw.replace(dataRefMatches[i], values[i]);
    }
  }
  return raw;
}

/** 
 * @returns {import('../index').PublishConfig }
 */
function processData(data) {
  if (typeof data === 'string') {
    return processText(data);
  }
  if (typeof data === 'object') {
    for (const prop in data) {
      data[prop] = processData(data[prop]);
    }
  }
  return data;
}

function truncate(text, length) {
  if (text && text.length > length) {
    return text.slice(0, length) + "...";
  } else {
    return text;
  }
}

function getPrettyDuration(ms, format) {
  return pretty_ms(parseInt(ms), { [format]: true, secondsDecimalDigits: 0 })
}

function getTitleText({ result, target }) {
  const title = target.inputs.title ? target.inputs.title : result.name;
  if (target.inputs.title_suffix) {
    return `${title} ${target.inputs.title_suffix}`;
  }
  return `${title}`;
}

function getResultText({ result }) {
  const percentage = getPercentage(result.passed, result.total);
  return `${result.passed} / ${result.total} Passed (${percentage}%)`;
}

/**
 * Checks Environment/System details
 * OS Version, NodeJS Version
 */
function checkEnvDetails() {
  if (!semver.gte(process.version, MIN_NODE_VERSION)) {
    throw new Error(`❌ Supported NodeJS version is >= v${MIN_NODE_VERSION}. Current version is ${process.version}`)
  }
  
  return `Environment Details - NodeJS ${process.version}, OS: ${os.platform()}, Version: ${os.release()}, arch: ${os.machine()}`
}

/**
 * 
 * @param {object} param0
 * @param {string | Function} param0.condition 
 */
async function checkCondition({ condition, result, target, extension }) {
  if (typeof condition === 'function') {
    return await condition({ target, result, extension });
  } else {
    const lower_condition = condition.toLowerCase();
    if (ALLOWED_CONDITIONS.has(lower_condition)) {
      return lower_condition.includes(result.status.toLowerCase());
    } else if (GENERIC_CONDITIONS.has(lower_condition)) {
      return lower_condition === 'always';
    } else {
      return eval(condition);
    }
  }
}

module.exports = {
  getPercentage,
  processData,
  truncate,
  getPrettyDuration,
  getTitleText,
  getResultText,
  checkCondition,
  checkEnvDetails,
}