const { BaseCI } = require('./base.ci');

const ENV = process.env;

class CircleCI extends BaseCI {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.setInfo(this.targets.ci, 'CIRCLE_CI');
    this.setInfo(this.targets.git, '');
    this.setInfo(this.targets.repository_url, ENV.CIRCLE_REPOSITORY_URL);
    this.setInfo(this.targets.repository_name, ENV.CIRCLE_PROJECT_REPONAME);
    this.setInfo(this.targets.repository_ref, ENV.CIRCLE_BRANCH);
    this.setInfo(this.targets.repository_commit_sha, ENV.CIRCLE_SHA1);
    this.setInfo(this.targets.branch_url, '');
    this.setInfo(this.targets.branch_name, ENV.CIRCLE_BRANCH);
    this.setInfo(this.targets.pull_request_url,'');
    this.setInfo(this.targets.pull_request_name, '');
    this.setInfo(this.targets.build_url, ENV.CIRCLE_BUILD_URL);
    this.setInfo(this.targets.build_number, ENV.CIRCLE_BUILD_NUM);
    this.setInfo(this.targets.build_name, ENV.CIRCLE_JOB);
    this.setInfo(this.targets.build_reason, 'Push');
    this.setInfo(this.targets.user, ENV.CIRCLE_USERNAME, true);
  }
}

module.exports = {
  CircleCI
}
