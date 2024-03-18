const ENV = process.env;

function getCIInformation() {
  if (ENV.GITHUB_ACTIONS) {
    return getGitHubActionsInformation();
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
    user: ENV.USER || ENV.USERNAME
  }
}

module.exports = {
  getCIInformation
}