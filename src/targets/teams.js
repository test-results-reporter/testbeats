const request = require('phin-retry');
const { toColonNotation } = require('colon-notation');
const { getPercentage, getReportType, getUrl, truncate, getReportPortalDefectsSummary } = require('../helpers/helper');
const { getLaunchDetails } = require('../helpers/report-portal');

function getTitleText(result, options) {
  const title = options.title ? options.title : result.name;
  if (options.title_suffix) {
    return `${title} ${options.title_suffix}`;
  }
  return `${title}`;
}

function getTitleTextBlock(testResult, opts) {
  const title = getTitleText(testResult, opts);
  const emoji = testResult.status === 'PASS' ? '✅' : '❌';
  const report = getReportType(opts);
  let text = '';
  if (report.includes('slim')) {
    text = `${emoji} ${title}`;
  } else if (testResult.suites.length > 1) {
    text = title;
  } else {
    text = `${emoji} ${title}`;
  }
  return {
    "type": "TextBlock",
    "text": text,
    "size": "medium",
    "weight": "bolder"
  }
}

function getMainSummary(result) {
  const facts = [];
  const percentage = getPercentage(result.passed, result.total);
  facts.push({
    "title": "Results:",
    "value": `${result.passed} / ${result.total} Passed (${percentage}%)`
  });
  facts.push({
    "title": "Duration:",
    "value": `${toColonNotation(parseInt(result.duration))}`
  });
  return {
    "type": "FactSet",
    "facts": facts
  }
}

function getSuiteSummary(suite) {
  const percentage = getPercentage(suite.passed, suite.total);
  const emoji = suite.status === 'PASS' ? '✅' : '❌';
  return [
    {
      "type": "TextBlock",
      "text": `${emoji} ${suite.name}`,
      "isSubtle": true,
      "weight": "bolder"
    },
    {
      "type": "FactSet",
      "facts": [
        {
          "title": "Results:",
          "value": `${suite.passed} / ${suite.total} Passed (${percentage}%)`
        },
        {
          "title": "Duration:",
          "value": `${toColonNotation(parseInt(suite.duration))}`
        }
      ]
    }
  ]
}

async function getReportPortalAnalysisBlocks(opts) {
  try {
    const { statistics } = await getLaunchDetails(opts);
    if (statistics && statistics.defects) {
      const results = getReportPortalDefectsSummary(statistics.defects);
      return [
        {
          "type": "TextBlock",
          "text": "Report Portal Analysis",
          "isSubtle": true,
          "weight": "bolder",
          "separator": true
        },
        {
          "type": "TextBlock",
          "text": results.join(' ｜ ')
        }
      ]
    }
  } catch (error) {
    console.log('Failed to get report portal analysis');
    console.log(error);
  }
}

function getLinks(opts) {
  const links = [];
  for (const link of opts.links) {
    links.push(`[${link.text}](${link.url})`);
  }
  return {
    "type": "TextBlock",
    "text": links.join(' ｜ '),
    "separator": true
  }
}

function getPayloadRoot() {
  return {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [],
    "actions": []
  };
}

function getFailureDetailsFactSets(suite) {
  const fact_sets = [];
  const cases = suite.cases;
  for (let i = 0; i < cases.length; i++) {
    const test_case = cases[i];
    if (test_case.status === 'FAIL') {
      fact_sets.push({
        "type": "FactSet",
        "facts": [
          {
            "title": "Test:",
            "value": test_case.name
          },
          {
            "title": "Error:",
            "value": truncate(test_case.failure, 150)
          }
        ]
      });
    }
  }
  return fact_sets;
}

async function attachReportPortalAnalysis(adaptive, testResult, opts) {
  if (testResult.status === 'PASS') {
    return;
  }
  if (!opts.report_portal_analysis) {
    return;
  }
  const blocks = await getReportPortalAnalysisBlocks(opts.report_portal_analysis);
  if (blocks) {
    adaptive.body.push(blocks[0]);
    adaptive.body.push(blocks[1]);
  }
}

function attachLinks(adaptive, opts) {
  if (opts.links) {
    adaptive.body.push(getLinks(opts));
  }
}

async function getTestSummaryMessage(testResults, opts) {
  const testResult = testResults[0];
  const adaptive = getPayloadRoot();
  adaptive.body.push(getTitleTextBlock(testResult, opts));
  adaptive.body.push(getMainSummary(testResult));
  if (testResult.suites.length > 1) {
    for (let i = 0; i < testResult.suites.length; i++) {
      const suite = testResult.suites[i];
      adaptive.body.push(...getSuiteSummary(suite));
    }
  }
  await attachReportPortalAnalysis(adaptive, testResult, opts);
  attachLinks(adaptive, opts);
  const payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": adaptive
      }
    ]
  };
  return payload;
}

async function getFailureSummaryMessage(testResults, opts) {
  const testResult = testResults[0];
  if (testResult.status === 'PASS') {
    return null;
  }
  const adaptive = getPayloadRoot();
  adaptive.body.push(getTitleTextBlock(testResult, opts));
  adaptive.body.push(getMainSummary(testResult));
  if (testResult.suites.length > 1) {
    for (let i = 0; i < testResult.suites.length; i++) {
      const suite = testResult.suites[i];
      if (suite.status === 'FAIL') {
        adaptive.body.push(...getSuiteSummary(suite));
      }
    }
  }
  await attachReportPortalAnalysis(adaptive, testResult, opts);
  attachLinks(adaptive, opts);
  const payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": adaptive
      }
    ]
  };
  return payload;
}

async function getTestSummarySlimMessage(testResults, opts) {
  const testResult = testResults[0];
  const adaptive = getPayloadRoot();
  adaptive.body.push(getTitleTextBlock(testResult, opts));
  adaptive.body.push(getMainSummary(testResult));
  await attachReportPortalAnalysis(adaptive, testResult, opts);
  attachLinks(adaptive, opts);
  const payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": adaptive
      }
    ]
  };
  return payload;
}

async function getFailureSummarySlimMessage(testResults, opts) {
  const testResult = testResults[0];
  if (testResult.status === 'PASS') {
    return null;
  }
  const adaptive = getPayloadRoot();
  adaptive.body.push(getTitleTextBlock(testResult, opts));
  adaptive.body.push(getMainSummary(testResult));
  await attachReportPortalAnalysis(adaptive, testResult, opts);
  attachLinks(adaptive, opts);
  const payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": adaptive
      }
    ]
  };
  return payload;
}

async function getFailureDetailsMessage(results, options) {
  const result = results[0];
  if (result.status === 'PASS') {
    return null;
  }
  const adaptive = getPayloadRoot();
  adaptive.body.push(getTitleTextBlock(result, options));
  adaptive.body.push(getMainSummary(result));
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      adaptive.body.push(...getSuiteSummary(suite));
      if (suite.status === 'FAIL') {
        adaptive.body.push(...getFailureDetailsFactSets(suite));
      }
    }
  } else {
    const suite = result.suites[0];
    adaptive.body.push(...getFailureDetailsFactSets(suite));
  }
  await attachReportPortalAnalysis(adaptive, result, options);
  attachLinks(adaptive, options);
  const payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": adaptive
      }
    ]
  };
  return payload;
}

async function getFailureDetailsSlimMessage(results, options) {
  const result = results[0];
  if (result.status === 'PASS') {
    return null;
  }
  const adaptive = getPayloadRoot();
  adaptive.body.push(getTitleTextBlock(result, options));
  adaptive.body.push(getMainSummary(result));
  if (result.suites.length > 1) {
    for (let i = 0; i < result.suites.length; i++) {
      const suite = result.suites[i];
      if (suite.status === 'FAIL') {
        adaptive.body.push(...getSuiteSummary(suite));
        adaptive.body.push(...getFailureDetailsFactSets(suite));
      }
    }
  } else {
    const suite = result.suites[0];
    adaptive.body.push(...getFailureDetailsFactSets(suite));
  }
  await attachReportPortalAnalysis(adaptive, result, options);
  attachLinks(adaptive, options);
  const payload = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": adaptive
      }
    ]
  };
  return payload;
}

function getMessage(options, results) {
  const report = getReportType(options);
  switch (report) {
    case 'test-summary':
      return getTestSummaryMessage(results, options);
    case 'failure-summary':
      return getFailureSummaryMessage(results, options);
    case 'test-summary-slim':
      return getTestSummarySlimMessage(results, options);
    case 'failure-summary-slim':
      return getFailureSummarySlimMessage(results, options);
    case 'failure-details':
      return getFailureDetailsMessage(results, options);
    case 'failure-details-slim':
      return getFailureDetailsSlimMessage(results, options);
    default:
      console.log('UnSupported Report Type');
      break;
  }
}

async function send(options, results) {
  const message = await getMessage(options, results);
  if (message) {
    return request.post({
      url: getUrl(options),
      body: message
    });
  }
}

module.exports = {
  send
}
