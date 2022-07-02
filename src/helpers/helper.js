const pretty_ms = require('pretty-ms');

const DATA_REF_PATTERN = /(\{[^\}]+\})/g;
const ALLOWED_CONDITIONS = new Set(['pass', 'fail', 'passorfail']);

function getPercentage(x, y) {
  if (y > 0) {
    return Math.round((x / y) * 100);
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
 * 
 * @param {object} param0
 * @param {string} param0.condition 
 */
function checkCondition({ condition, result }) {
  const lower_condition = condition.toLowerCase();
  if (ALLOWED_CONDITIONS.has(lower_condition)) {
    return lower_condition.includes(result.status.toLowerCase());
  } else {
    return eval(condition);
  }
}

module.exports = {
  getPercentage,
  processData,
  truncate,
  getPrettyDuration,
  getTitleText,
  getResultText,
  checkCondition
}