const ENV = process.env;

/**
 * @returns {import('../../extensions/extensions').ICIInfo}
 */
function info() {
  const jenkins = {
    ci: 'JENKINS',
    git: '',
    repository_url: ENV.GIT_URL || ENV.GITHUB_URL || ENV.BITBUCKET_URL,
    repository_name: ENV.JOB_NAME,
    repository_ref: ENV.BRANCH || ENV.BRANCH_NAME,
    repository_commit_sha: ENV.GIT_COMMIT || ENV.GIT_COMMIT_SHA || ENV.GITHUB_SHA || ENV.BITBUCKET_COMMIT,
    branch_url: '',
    branch_name: '',
    pull_request: false,
    build_url: ENV.BUILD_URL,
    build_number: ENV.BUILD_NUMBER,
    build_name: ENV.JOB_NAME,
    build_reason: ENV.BUILD_CAUSE,
    user: ENV.USER || ENV.USERNAME
  }

  jenkins.branch_url = jenkins.repository_url + jenkins.repository_ref.replace('refs/heads/', '/tree/');
  jenkins.branch_name = jenkins.repository_ref.replace('refs/heads/', '');

  if (jenkins.repository_ref.includes('refs/pull')) {
    jenkins.pull_request = {
      url: jenkins.repository_url + jenkins.repository_ref.replace('refs/pull/', '/pull/'),
      name: jenkins.repository_ref.replace('refs/pull/', '').replace('/merge', '')
    }
  }

  return jenkins_info;
}

module.exports = {
  info
}
