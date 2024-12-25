const { BaseCI } = require('./base.ci');

const ENV = process.env;

class GitLabCI extends BaseCI {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.setInfo(this.targets.ci, 'GITLAB');
    this.setInfo(this.targets.git, 'GITLAB');
    this.setInfo(this.targets.repository_url, ENV.CI_PROJECT_URL);
    this.setInfo(this.targets.repository_name, ENV.CI_PROJECT_NAME);
    this.setInfo(this.targets.repository_ref, '/-/tree/' + (ENV.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME || ENV.CI_COMMIT_REF_NAME));
    this.setInfo(this.targets.repository_commit_sha, ENV.CI_MERGE_REQUEST_SOURCE_BRANCH_SHA || ENV.CI_COMMIT_SHA);
    this.setInfo(this.targets.branch_url, ENV.CI_PROJECT_URL + '/-/tree/' + (ENV.CI_COMMIT_REF_NAME || ENV.CI_COMMIT_BRANCH));
    this.setInfo(this.targets.branch_name, ENV.CI_COMMIT_REF_NAME || ENV.CI_COMMIT_BRANCH);
    this.setInfo(this.targets.pull_request_url,'');
    this.setInfo(this.targets.pull_request_name, '');
    this.setInfo(this.targets.build_url, ENV.CI_JOB_URL);
    this.setInfo(this.targets.build_number, ENV.CI_JOB_ID);
    this.setInfo(this.targets.build_name, ENV.CI_JOB_NAME);
    this.setInfo(this.targets.build_reason, ENV.CI_PIPELINE_SOURCE);

    if (ENV.CI_OPEN_MERGE_REQUESTS) {
      const pr_number = ENV.CI_OPEN_MERGE_REQUESTS.split("!")[1];
      this.setInfo(this.targets.pull_request_name, "#" + pr_number);
      this.setInfo(this.targets.pull_request_url, ENV.CI_PROJECT_URL + "/-/merge_requests/" + pr_number);
    }
  }
}

module.exports = {
  GitLabCI
}
