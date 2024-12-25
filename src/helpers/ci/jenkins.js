const { BaseCI } = require('./base.ci');

const ENV = process.env;

class JenkinsCI extends BaseCI {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.setInfo(this.targets.ci, 'JENKINS');
    this.setInfo(this.targets.git, '');
    this.setInfo(this.targets.repository_url, ENV.GIT_URL || ENV.GITHUB_URL || ENV.BITBUCKET_URL);
    this.setInfo(this.targets.repository_name, ENV.JOB_NAME);
    this.setInfo(this.targets.repository_ref, ENV.BRANCH || ENV.BRANCH_NAME);
    this.setInfo(this.targets.repository_commit_sha, ENV.GIT_COMMIT || ENV.GIT_COMMIT_SHA || ENV.GITHUB_SHA || ENV.BITBUCKET_COMMIT);
    this.setInfo(this.targets.branch_url, this.repository_url + this.repository_ref.replace('refs/heads/', '/tree/'));
    this.setInfo(this.targets.branch_name, this.repository_ref.replace('refs/heads/', ''));

    if (this.repository_ref.includes('refs/pull')) {
      this.setInfo(this.targets.pull_request_url, this.repository_url + this.repository_ref.replace('refs/pull/', '/pull/'));
      this.setInfo(this.targets.pull_request_name, this.repository_ref.replace('refs/pull/', '').replace('/merge', ''));
    }

    this.setInfo(this.targets.build_url, ENV.BUILD_URL);
    this.setInfo(this.targets.build_number, ENV.BUILD_NUMBER);
    this.setInfo(this.targets.build_name, ENV.JOB_NAME);
    this.setInfo(this.targets.build_reason, ENV.BUILD_CAUSE);
    this.setInfo(this.targets.user, ENV.USER || ENV.USERNAME, true);
  }
}

module.exports = {
  JenkinsCI
}
