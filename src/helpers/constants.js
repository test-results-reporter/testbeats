const STATUS = Object.freeze({
  PASS: 'pass',
  FAIL: 'fail',
  PASS_OR_FAIL: 'passOrfail'
});

const HOOK = Object.freeze({
  START: 'start',
  AFTER_SUMMARY: 'after-summary',
  END: 'end',
});

const TARGET = Object.freeze({
  SLACK: 'slack',
  TEAMS: 'teams',
  CHAT: 'chat',
  CUSTOM: 'custom',
  DELAY: 'delay',
  INFLUX: 'influx',
});

const EXTENSION = Object.freeze({
  AI_FAILURE_SUMMARY: 'ai-failure-summary',
  SMART_ANALYSIS: 'smart-analysis',
  ERROR_CLUSTERS: 'error-clusters',
  HYPERLINKS: 'hyperlinks',
  MENTIONS: 'mentions',
  REPORT_PORTAL_ANALYSIS: 'report-portal-analysis',
  REPORT_PORTAL_HISTORY: 'report-portal-history',
  QUICK_CHART_TEST_SUMMARY: 'quick-chart-test-summary',
  PERCY_ANALYSIS: 'percy-analysis',
  CUSTOM: 'custom',
  METADATA: 'metadata',
  CI_INFO: 'ci-info',
});

const URLS = Object.freeze({
  PERCY: 'https://percy.io',
  QUICK_CHART: 'https://quickchart.io'
});

const MIN_NODE_VERSION = 14;

module.exports = Object.freeze({
  STATUS,
  HOOK,
  TARGET,
  EXTENSION,
  URLS,
  MIN_NODE_VERSION
});