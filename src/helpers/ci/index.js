const { GitHubCI } = require('./github');
const { GitLabCI } = require('./gitlab');
const { JenkinsCI } = require('./jenkins');
const { AzureDevOpsCI } = require('./azure-devops');
const { CircleCI } = require('./circle-ci');
const { BaseCI } = require('./base.ci');

const ENV = process.env;

/**
 * @returns {import('../../extensions/extensions').ICIInfo}
 */
function getCIInformation() {
  if (ENV.GITHUB_ACTIONS) {
    const ci = new GitHubCI();
    return ci.info();
  }

  if (ENV.GITLAB_CI) {
    const ci = new GitLabCI();
    return ci.info();
  }

  if (ENV.JENKINS_URL) {
    const ci = new JenkinsCI();
    return ci.info();
  }

  if (ENV.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI) {
    const ci = new AzureDevOpsCI();
    return ci.info();
  }

  if (ENV.CIRCLECI) {
    const ci = new CircleCI();
    return ci.info();
  }

  const ci = new BaseCI();
  return ci.info();
}

module.exports = {
  getCIInformation
}