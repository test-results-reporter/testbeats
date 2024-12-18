const ENV = process.env;

/**
 * @returns {import('../../extensions/extensions').ICIInfo}
 */
function info() {
  const circle = {
    ci: 'CIRCLE_CI',
    git: '',
    repository_url: ENV.CIRCLE_REPOSITORY_URL,
    repository_name: ENV.CIRCLE_PROJECT_REPONAME, // Need to find a better match
    repository_ref: ENV.CIRCLE_BRANCH,
    repository_commit_sha: ENV.CIRCLE_SHA1,
    branch_url: '',
    branch_name: ENV.CIRCLE_BRANCH,
    pull_request_url:'',
    pull_request_name: '',
    build_url: ENV.CIRCLE_BUILD_URL,
    build_number: ENV.CIRCLE_BUILD_NUM,
    build_name: ENV.CIRCLE_JOB,
    build_reason: 'Push',
    user: ENV.CIRCLE_USERNAME,
  }
  return circle
}

module.exports = {
  info
}
