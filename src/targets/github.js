const request = require('phin-retry');
const { getPercentage, truncate, getPrettyDuration } = require('../helpers/helper');
const extension_manager = require('../extensions');
const { HOOK, STATUS, TARGET } = require('../helpers/constants');
const logger = require('../utils/logger');

const PerformanceTestResult = require('performance-results-parser/src/models/PerformanceTestResult');
const { getValidMetrics, getMetricValuesText } = require('../helpers/performance');
const TestResult = require('test-results-parser/src/models/TestResult');
const { getPlatform } = require('../platforms');

const STATUSES = {
  GOOD: '✅',
  WARNING: '⚠️',
  DANGER: '❌'
}

async function run({ result, target }) {
  setTargetInputs(target);
  const payload = getMainPayload();
  if (result instanceof PerformanceTestResult) {
    await setPerformancePayload({ result, target, payload });
  } else {
    await setFunctionalPayload({ result, target, payload });
  }
  const message = getMarkdownMessage({ result, target, payload });
  logger.info(`🔔 Publishing results to GitHub PR...`);
  return await publishToGitHub({ target, message });
}

async function setFunctionalPayload({ result, target, payload }) {
  await extension_manager.run({ result, target, payload, hook: HOOK.START });
  setMainContent({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.AFTER_SUMMARY });
  setSuiteContent({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.END });
}

function setTargetInputs(target) {
  target.inputs = Object.assign({}, default_inputs, target.inputs);
  if (target.inputs.publish === 'test-summary-slim') {
    target.inputs.include_suites = false;
  }
  if (target.inputs.publish === 'failure-details') {
    target.inputs.include_failure_details = true;
  }
}

function getMainPayload() {
  return {
    content: []
  };
}

function setMainContent({ result, target, payload }) {
  const titleText = getTitleText(result, target);
  const resultText = getResultText(result);
  const durationText = getPrettyDuration(result.duration, target.inputs.duration);

  let content = `## ${titleText}\n\n`;
  content += `**Results**: ${resultText}\n`;
  content += `**Duration**: ${durationText}\n\n`;

  payload.content.push(content);
}

function getTitleText(result, target) {
  let text = target.inputs.title ? target.inputs.title : result.name;
  if (target.inputs.title_suffix) {
    text = `${text} ${target.inputs.title_suffix}`;
  }

  const status = result.status !== 'PASS' ? STATUSES.DANGER : STATUSES.GOOD;
  return `${status} ${text}`;
}

function getResultText(result) {
  const percentage = getPercentage(result.passed, result.total);
  return `${result.passed} / ${result.total} Passed (${percentage}%)`;
}

function setSuiteContent({ result, target, payload }) {
  let suite_count = 0;
  if (target.inputs.include_suites) {
    for (let i = 0; i < result.suites.length && suite_count < target.inputs.max_suites; i++) {
      const suite = result.suites[i];
      if (target.inputs.only_failures && suite.status !== 'FAIL') {
        continue;
      }

      // if suites length eq to 1 then main content will include suite summary
      if (result.suites.length > 1) {
        payload.content.push(getSuiteSummary({ target, suite }));
        suite_count += 1;
      }

      if (target.inputs.include_failure_details) {
        // Only attach failure details if there were failures
        if (suite.failed > 0) {
          payload.content.push(getFailureDetails(suite));
        }
      }
    }
  }
}

function getSuiteSummary({ target, suite }) {
  const platform = getPlatform(TARGET.GITHUB);
  const text = platform.getSuiteSummaryText(target, suite);
  return `### ${suite.name}\n${text}\n\n`;
}

function getFailureDetails(suite) {
  let content = `<details>\n<summary>❌ Failed Tests</summary>\n\n`;
  const cases = suite.cases;
  for (let i = 0; i < cases.length; i++) {
    const test_case = cases[i];
    if (test_case.status === 'FAIL') {
      content += `**Test**: ${test_case.name}\n`;
      content += `**Error**: \n\`\`\`\n${truncate(test_case.failure ?? 'N/A', 500)}\n\`\`\`\n\n`;
    }
  }
  content += `</details>\n\n`;
  return content;
}

function getMarkdownMessage({ result, target, payload }) {
  return payload.content.join('');
}

async function publishToGitHub({ target, message }) {
  const { repo, owner, pull_number } = extractGitHubInfo(target);
  const github_token = target.inputs.github_token || process.env.GITHUB_TOKEN;

  if (!github_token) {
    throw new Error('GitHub token is required. Set GITHUB_TOKEN environment variable or provide github_token in target inputs.');
  }

  if (!pull_number) {
    throw new Error('Pull request number not found. This target only works in GitHub Actions triggered by pull requests.');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${pull_number}/comments`;

  const comment_body = target.inputs.comment_title ?
    `${target.inputs.comment_title}\n\n${message}` :
    message;

  const headers = {
    'Authorization': `token ${github_token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'testbeats'
  };

  if (target.inputs.update_comment) {
    // Try to find existing comment and update it
    const existingComment = await findExistingComment({ owner, repo, pull_number, github_token, comment_title: target.inputs.comment_title });
    if (existingComment) {
      const updateUrl = `https://api.github.com/repos/${owner}/${repo}/issues/comments/${existingComment.id}`;
      return request.patch({
        url: updateUrl,
        headers,
        body: { body: comment_body }
      });
    }
  }

  // Create new comment
  return request.post({
    url,
    headers,
    body: { body: comment_body }
  });
}

async function findExistingComment({ owner, repo, pull_number, github_token, comment_title }) {
  if (!comment_title) return null;

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${pull_number}/comments`;
    const headers = {
      'Authorization': `token ${github_token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'testbeats'
    };

    const response = await request.get({ url, headers });
    const comments = JSON.parse(response.body);

    return comments.find(comment => comment.body.includes(comment_title));
  } catch (error) {
    logger.warn('Failed to find existing comment:', error.message);
    return null;
  }
}

function extractGitHubInfo(target) {
  // Extract from environment variables (GitHub Actions)
  const repository = process.env.GITHUB_REPOSITORY; // format: owner/repo
  const ref = process.env.GITHUB_REF; // format: refs/pull/123/merge

  if (!repository) {
    throw new Error('GITHUB_REPOSITORY environment variable not found. This target only works in GitHub Actions.');
  }

  const [owner, repo] = repository.split('/');
  let pull_number = null;

  if (ref && ref.includes('refs/pull/')) {
    pull_number = ref.replace('refs/pull/', '').replace('/merge', '');
  }

  // Allow override from target inputs
  return {
    owner: target.inputs.owner || owner,
    repo: target.inputs.repo || repo,
    pull_number: target.inputs.pull_number || pull_number
  };
}

async function setPerformancePayload({ result, target, payload }) {
  await extension_manager.run({ result, target, payload, hook: HOOK.START });
  await setPerformanceMainContent({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.AFTER_SUMMARY });
  await setTransactionContent({ result, target, payload });
  await extension_manager.run({ result, target, payload, hook: HOOK.END });
}

async function setPerformanceMainContent({ result, target, payload }) {
  const titleText = getTitleText(result, target);
  let content = `## ${titleText}\n\n`;

  const metrics = getValidMetrics(result.metrics);
  if (metrics.length > 0) {
    content += `**Performance Metrics**:\n`;
    content += getMetricValuesText(metrics);
    content += '\n\n';
  }

  content += `**Duration**: ${getPrettyDuration(result.duration, target.inputs.duration)}\n\n`;
  payload.content.push(content);
}

async function setTransactionContent({ result, target, payload }) {
  let transaction_count = 0;
  if (target.inputs.include_suites) {
    for (let i = 0; i < result.transactions.length && transaction_count < target.inputs.max_suites; i++) {
      const transaction = result.transactions[i];
      if (target.inputs.only_failures && transaction.status !== 'FAIL') {
        continue;
      }

      payload.content.push(getTransactionSummary({ target, transaction }));
      transaction_count += 1;
    }
  }
}

function getTransactionSummary({ target, transaction }) {
  let content = `### ${transaction.name}\n`;
  content += `**Status**: ${transaction.status === 'PASS' ? STATUSES.GOOD : STATUSES.DANGER}\n`;
  content += `**Duration**: ${getPrettyDuration(transaction.duration, target.inputs.duration)}\n`;

  if (transaction.metrics && transaction.metrics.length > 0) {
    const metrics = getValidMetrics(transaction.metrics);
    if (metrics.length > 0) {
      content += `**Metrics**: ${getMetricValuesText(metrics)}\n`;
    }
  }

  content += '\n';
  return content;
}

async function handleErrors({ target, errors }) {
  logger.error('GitHub target errors:', errors);
}

const default_inputs = {
  github_token: undefined,
  comment_title: undefined,
  update_comment: false,
  owner: undefined,
  repo: undefined,
  pull_number: undefined,
  title: undefined,
  title_suffix: undefined,
  include_suites: true,
  include_failure_details: false,
  only_failures: false,
  max_suites: 10,
  duration: 'long',
  publish: 'test-summary'
};

const default_options = {
  condition: STATUS.PASS_OR_FAIL
};

module.exports = {
  name: 'GitHub',
  run,
  handleErrors,
  default_inputs,
  default_options
};