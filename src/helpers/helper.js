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

function getReportPortalDefectsSummary(defects, bold = '**') {
  const results = [];
  if (defects.product_bug) {
    results.push(`${bold}🔴 PB - ${defects.product_bug.total}${bold}`);
  } else {
    results.push(`🔴 PB - 0`);
  }
  if (defects.automation_bug) {
    results.push(`${bold}🟡 AB - ${defects.automation_bug.total}${bold}`);
  } else {
    results.push(`🟡 AB - 0`);
  }
  if (defects.system_issue) {
    results.push(`${bold}🔵 SI - ${defects.system_issue.total}${bold}`);
  } else {
    results.push(`🔵 SI - 0`);
  }
  if (defects.no_defect) {
    results.push(`${bold}◯ ND - ${defects.no_defect.total}${bold}`);
  } else {
    results.push(`◯ ND - 0`);
  }
  if (defects.to_investigate) {
    results.push(`${bold}🟠 TI - ${defects.to_investigate.total}${bold}`);
  } else {
    results.push(`🟠 TI - 0`);
  }
  return results;
}

module.exports = {
  getPercentage,
  processData,
  getReportType,
  getUrl,
  truncate,
  getReportPortalDefectsSummary
}