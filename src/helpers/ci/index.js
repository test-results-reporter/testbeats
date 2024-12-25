const github = require('./github');
const gitlab = require('./gitlab');
const jenkins = require('./jenkins');
const azure_devops = require('./azure-devops');
const circle_ci = require('./circle-ci');
const { BaseCI } = require('./base.ci');

const ENV = process.env;

/**
 * @returns {import('../../extensions/extensions').ICIInfo}
 */
function getCIInformation() {
  if (ENV.GITHUB_ACTIONS) {
    const ci = new github.GitHubCI();
    return ci.info();
  }

  if (ENV.GITLAB_CI) {
    const ci = new gitlab.GitLabCI();
    return ci.info();
  }

  if (ENV.JENKINS_URL) {
    const ci = new jenkins.JenkinsCI();
    return ci.info();
  }

  if (ENV.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI) {
    const ci = new azure_devops.AzureDevOpsCI();
    return ci.info();
  }

  if (ENV.CIRCLECI) {
    const ci = new circle_ci.CircleCI();
    return ci.info();
  }

  const ci = new BaseCI();
  return ci.info();
}

module.exports = {
  getCIInformation
}