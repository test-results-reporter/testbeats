const ENV = process.env;

/**
 * @returns {import('../../extensions/extensions').ICIInfo}
 */
function info() {
  const azure_devops = {
    ci: 'AZURE_DEVOPS_PIPELINES',
    git: 'AZURE_DEVOPS_REPOS',
    repository_url: ENV.BUILD_REPOSITORY_URI,
    repository_name: ENV.BUILD_REPOSITORY_NAME,
    repository_ref: ENV.BUILD_SOURCEBRANCH,
    repository_commit_sha: ENV.BUILD_SOURCEVERSION,
    branch_url: '',
    branch_name: '',
    pull_request_url:'',
    pull_request_name: '',
    build_url: ENV.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI + ENV.SYSTEM_TEAMPROJECT + '/_build/results?buildId=' + ENV.BUILD_BUILDID,
    build_number: ENV.BUILD_BUILDNUMBER,
    build_name: ENV.BUILD_DEFINITIONNAME,
    build_reason: ENV.BUILD_REASON,
    user: ENV.BUILD_REQUESTEDFOR
  }

  azure_devops.branch_url = azure_devops.repository_url + azure_devops.repository_ref.replace('refs/heads/', '/tree/');
  azure_devops.branch_name = azure_devops.repository_ref.replace('refs/heads/', '');

  if (azure_devops.repository_ref.includes('refs/pull')) {
    azure_devops.pull_request_url = azure_devops.repository_url + azure_devops.repository_ref.replace('refs/pull/', '/pull/');
    azure_devops.pull_request_name = azure_devops.repository_ref.replace('refs/pull/', '').replace('/merge', '');
  }
  return azure_devops;
}

module.exports = {
  info
}
