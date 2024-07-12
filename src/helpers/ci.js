const ENV = process.env;

/**
 * @returns {import('../extensions/extensions').ICIInfo}
 */
function getCIInformation() {
  if (ENV.GITHUB_ACTIONS) {
    return getGitHubActionsInformation();
  }
  if (ENV.GITLAB_CI) {
    return getGitLabInformation();
  }
  if (ENV.JENKINS_URL) {
    return getJenkinsInformation();
  }
  if (ENV.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI) {
    return getAzureDevOpsInformation();
  }
}

function getGitHubActionsInformation() {
  return {
    ci: 'GITHUB_ACTIONS',
    git: 'GITHUB',
    repository_url: ENV.GITHUB_SERVER_URL + '/' + ENV.GITHUB_REPOSITORY,
    repository_name: ENV.GITHUB_REPOSITORY,
    repository_ref: ENV.GITHUB_REF,
    repository_commit_sha: ENV.GITHUB_SHA,
    build_url: ENV.GITHUB_SERVER_URL + '/' + ENV.GITHUB_REPOSITORY + '/actions/runs/' + ENV.GITHUB_RUN_ID,
    build_number: ENV.GITHUB_RUN_NUMBER,
    build_name: ENV.GITHUB_WORKFLOW,
    build_reason: ENV.GITHUB_EVENT_NAME,
    user: ENV.GITHUB_ACTOR,
  }
}

function getAzureDevOpsInformation() {
  return {
    ci: 'AZURE_DEVOPS_PIPELINES',
    git: 'AZURE_DEVOPS_REPOS',
    repository_url: ENV.BUILD_REPOSITORY_URI,
    repository_name: ENV.BUILD_REPOSITORY_NAME,
    repository_ref: ENV.BUILD_SOURCEBRANCH,
    repository_commit_sha: ENV.BUILD_SOURCEVERSION,
    build_url: ENV.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI + ENV.SYSTEM_TEAMPROJECT + '/_build/results?buildId=' + ENV.BUILD_BUILDID,
    build_number: ENV.BUILD_BUILDNUMBER,
    build_name: ENV.BUILD_DEFINITIONNAME,
    build_reason: ENV.BUILD_REASON,
    user: ENV.BUILD_REQUESTEDFOR
  }
}

function getJenkinsInformation() {
  return {
    ci: 'JENKINS',
    git: '',
    repository_url: ENV.GIT_URL || ENV.GITHUB_URL || ENV.BITBUCKET_URL,
    repository_name: ENV.JOB_NAME,
    repository_ref: ENV.BRANCH || ENV.BRANCH_NAME,
    repository_commit_sha: ENV.GIT_COMMIT || ENV.GIT_COMMIT_SHA || ENV.GITHUB_SHA || ENV.BITBUCKET_COMMIT,
    build_url: ENV.BUILD_URL,
    build_number: ENV.BUILD_NUMBER,
    build_name: ENV.JOB_NAME,
    build_reason: ENV.BUILD_CAUSE,
    user: ENV.USER || ENV.USERNAME
  }
}

function getGitLabInformation() {
  return {
    ci: 'GITLAB',
    git: 'GITLAB',
    repository_url: ENV.CI_PROJECT_URL,
    repository_name: ENV.CI_PROJECT_NAME,
    repository_ref: ENV.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME || ENV.CI_COMMIT_REF_NAME,
    repository_commit_sha:ENV.CI_MERGE_REQUEST_SOURCE_BRANCH_SHA || ENV.CI_COMMIT_SHA,
    build_url: ENV.CI_JOB_URL,
    build_number: ENV.CI_JOB_ID,
    build_name: ENV.CI_JOB_NAME,
    build_reason: ENV.CI_PIPELINE_SOURCE,
    user: ENV.GITLAB_USER_LOGIN || ENV.CI_COMMIT_AUTHOR
  }
}

module.exports = {
  getCIInformation
}