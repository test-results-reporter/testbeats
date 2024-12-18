const os = require('os');
const github = require('./github');
const gitlab = require('./gitlab');
const jenkins = require('./jenkins');
const azure_devops = require('./azure-devops');
const circle_ci = require('./circle-ci');
const system = require('./system');

const ENV = process.env;

/**
 * @returns {import('../../extensions/extensions').ICIInfo}
 */
function getCIInformation() {
  const ci_info = getBaseCIInfo();
  const system_info = system.info();
  return {
    ...ci_info,
    ...system_info
  }
}

function getBaseCIInfo() {
  if (ENV.GITHUB_ACTIONS) {
    return github.info();
  }
  if (ENV.GITLAB_CI) {
    return gitlab.info();
  }
  if (ENV.JENKINS_URL) {
    return jenkins.info();
  }
  if (ENV.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI) {
    return azure_devops.info();
  }
  if (ENV.CIRCLECI) {
    return circle_ci.info();
  }
  return getDefaultInformation();
}

function getDefaultInformation() {
  return {
    ci: ENV.TEST_BEATS_CI_NAME,
    git: ENV.TEST_BEATS_CI_GIT,
    repository_url: ENV.TEST_BEATS_CI_REPOSITORY_URL,
    repository_name: ENV.TEST_BEATS_CI_REPOSITORY_NAME,
    repository_ref: ENV.TEST_BEATS_CI_REPOSITORY_REF,
    repository_commit_sha: ENV.TEST_BEATS_CI_REPOSITORY_COMMIT_SHA,
    branch_url: ENV.TEST_BEATS_BRANCH_URL,
    branch_name: ENV.TEST_BEATS_BRANCH_NAME,
    pull_request_url: ENV.TEST_BEATS_PULL_REQUEST_URL,
    pull_request_name: ENV.TEST_BEATS_PULL_REQUEST_NAME,
    build_url: ENV.TEST_BEATS_CI_BUILD_URL,
    build_number: ENV.TEST_BEATS_CI_BUILD_NUMBER,
    build_name: ENV.TEST_BEATS_CI_BUILD_NAME,
    build_reason: ENV.TEST_BEATS_CI_BUILD_REASON,
    user: ENV.TEST_BEATS_CI_USER || os.userInfo().username
  }
}

module.exports = {
  getCIInformation
}