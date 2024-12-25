const { BaseCI } = require('./base.ci');

const ENV = process.env;

class GitHubCI extends BaseCI {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.setInfo(this.targets.ci, 'GITHUB_ACTIONS');
    this.setInfo(this.targets.git, 'GITHUB');
    this.setInfo(this.targets.repository_url, ENV.GITHUB_SERVER_URL + '/' + ENV.GITHUB_REPOSITORY);
    this.setInfo(this.targets.repository_name, ENV.GITHUB_REPOSITORY);
    this.setInfo(this.targets.repository_ref, ENV.GITHUB_REF);
    this.setInfo(this.targets.repository_commit_sha, ENV.GITHUB_SHA);
    this.setInfo(this.targets.build_url, ENV.GITHUB_SERVER_URL + '/' + ENV.GITHUB_REPOSITORY + '/actions/runs/' + ENV.GITHUB_RUN_ID);
    this.setInfo(this.targets.build_number, ENV.GITHUB_RUN_NUMBER);
    this.setInfo(this.targets.build_name, ENV.GITHUB_WORKFLOW);
    this.setInfo(this.targets.build_reason, ENV.GITHUB_EVENT_NAME);
    this.setInfo(this.targets.user, ENV.GITHUB_ACTOR, true);

    this.setInfo(this.targets.branch_url, this.repository_url + this.repository_ref.replace('refs/heads/', '/tree/'));
    this.setInfo(this.targets.branch_name, this.repository_ref.replace('refs/heads/', ''));

    if (this.repository_ref.includes('refs/pull')) {
      this.setInfo(this.targets.pull_request_url, this.repository_url + this.repository_ref.replace('refs/pull/', '/pull/'));
      this.setInfo(this.targets.pull_request_name, this.repository_ref.replace('refs/pull/', '').replace('/merge', ''));
    }
  }
}

module.exports = {
  GitHubCI
}