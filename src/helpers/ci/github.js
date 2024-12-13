const ENV = process.env;

/**
 * @returns {import('../../extensions/extensions').ICIInfo}
 */
function info() {
  const github = {
    ci: 'GITHUB_ACTIONS',
    git: 'GITHUB',
    repository_url: ENV.GITHUB_SERVER_URL + '/' + ENV.GITHUB_REPOSITORY,
    repository_name: ENV.GITHUB_REPOSITORY,
    repository_ref: ENV.GITHUB_REF,
    repository_commit_sha: ENV.GITHUB_SHA,
    branch_url: '',
    branch_name: '',
    pull_request_url:'',
    pull_request_name: '',
    build_url: ENV.GITHUB_SERVER_URL + '/' + ENV.GITHUB_REPOSITORY + '/actions/runs/' + ENV.GITHUB_RUN_ID,
    build_number: ENV.GITHUB_RUN_NUMBER,
    build_name: ENV.GITHUB_WORKFLOW,
    build_reason: ENV.GITHUB_EVENT_NAME,
    user: ENV.GITHUB_ACTOR,
  }

  github.branch_url = github.repository_url + github.repository_ref.replace('refs/heads/', '/tree/');
  github.branch_name = github.repository_ref.replace('refs/heads/', '');

  if (github.repository_ref.includes('refs/pull')) {
    github.pull_request_url = github.repository_url + github.repository_ref.replace('refs/pull/', '/pull/');
    github.pull_request_name = github.repository_ref.replace('refs/pull/', '').replace('/merge', '');
  }

  return github
}

module.exports = {
  info
}