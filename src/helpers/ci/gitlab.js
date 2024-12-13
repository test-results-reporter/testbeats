const ENV = process.env;

/**
 * @returns {import('../../extensions/extensions').ICIInfo}
 */
function info() {
  const gitlab = {
    ci: 'GITLAB',
    git: 'GITLAB',
    repository_url: ENV.CI_PROJECT_URL,
    repository_name: ENV.CI_PROJECT_NAME,
    repository_ref: '/-/tree/' + (ENV.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME || ENV.CI_COMMIT_REF_NAME),
    repository_commit_sha: ENV.CI_MERGE_REQUEST_SOURCE_BRANCH_SHA || ENV.CI_COMMIT_SHA,
    branch_url: ENV.CI_PROJECT_URL + '/-/tree/' + (ENV.CI_COMMIT_REF_NAME || ENV.CI_COMMIT_BRANCH),
    branch_name: ENV.CI_COMMIT_REF_NAME || ENV.CI_COMMIT_BRANCH,
    pull_request_url:'',
    pull_request_name: '',
    build_url: ENV.CI_JOB_URL,
    build_number: ENV.CI_JOB_ID,
    build_name: ENV.CI_JOB_NAME,
    build_reason: ENV.CI_PIPELINE_SOURCE,
    user: ENV.GITLAB_USER_LOGIN || ENV.CI_COMMIT_AUTHOR
  }

  if (ENV.CI_OPEN_MERGE_REQUESTS) {
    const pr_number = ENV.CI_OPEN_MERGE_REQUESTS.split("!")[1];
    gitlab.pull_request_name = "#" + pr_number;
    gitlab.pull_request_url = ENV.CI_PROJECT_URL + "/-/merge_requests/" + pr_number;
  }

  return gitlab
}

module.exports = {
  info
}
