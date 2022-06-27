const STATUS = Object.freeze({
  PASS: "pass",
  FAIL: "fail",
  PASS_OR_FAIL: "passOrfail"
});

const HOOK = Object.freeze({
  START: 'start',
  POST_MAIN: 'post-main',
  END: "end",
});

const TARGET = Object.freeze({
  SLACK: 'slack',
  TEAMS: 'teams',
  CHAT: 'chat',
  CUSTOM: "custom",
  DELAY: 'delay'
});

const EXTENSION = Object.freeze({
  HYPERLINKS: 'hyperlinks',
  MENTIONS: 'mentions',
  REPORT_PORTAL_ANALYSIS: "report-portal-analysis",
  REPORT_PORTAL_HISTORY: 'report-portal-history',
  QUICK_CHART_TEST_SUMMARY: "quick-chart-test-summary"
});

module.exports = Object.freeze({
  STATUS,
  HOOK,
  TARGET,
  EXTENSION
});