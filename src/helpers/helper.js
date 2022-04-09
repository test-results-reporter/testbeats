const DATA_REF_PATTERN = /(\{[^\}]+\})/g;

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

function getReportType(options) {
  if (options) {
    if (options.publish) return options.publish;
  }
  return 'test-summary';
}

function getUrl(options) {
  return options.url || options.webhook || options['incoming-webhook-url'];
}

function truncate(text, length) {
  if (text && text.length > length) {
    return text.slice(0, length) + "...";
  } else {
    return text;
  }
}

module.exports = {
  getPercentage,
  processData,
  getReportType,
  getUrl,
  truncate,
}