const { BaseCI } = require('./base.ci');

const ENV = process.env;

class AzureDevOpsCI extends BaseCI {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.setInfo(this.targets.ci, 'AZURE_DEVOPS_PIPELINES');
    this.setInfo(this.targets.git, 'AZURE_DEVOPS_REPOS');
    this.setInfo(this.targets.repository_url, ENV.BUILD_REPOSITORY_URI);
    this.setInfo(this.targets.repository_name, ENV.BUILD_REPOSITORY_NAME);
    this.setInfo(this.targets.repository_ref, ENV.BUILD_SOURCEBRANCH);
    this.setInfo(this.targets.repository_commit_sha, ENV.BUILD_SOURCEVERSION);
    this.setInfo(this.targets.build_url, ENV.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI + ENV.SYSTEM_TEAMPROJECT + '/_build/results?buildId=' + ENV.BUILD_BUILDID);
    this.setInfo(this.targets.build_number, ENV.BUILD_BUILDNUMBER);
    this.setInfo(this.targets.build_name, ENV.BUILD_DEFINITIONNAME);
    this.setInfo(this.targets.build_reason, ENV.BUILD_REASON);

    this.setInfo(this.targets.branch_url, this.repository_url + this.repository_ref.replace('refs/heads/', '/tree/'));
    this.setInfo(this.targets.branch_name, this.repository_ref.replace('refs/heads/', ''));

    if (this.repository_ref.includes('refs/pull')) {
      this.setInfo(this.targets.pull_request_url, this.repository_url + this.repository_ref.replace('refs/pull/', '/pull/'));
      this.setInfo(this.targets.pull_request_name, this.repository_ref.replace('refs/pull/', '').replace('/merge', ''));
    }

    this.setInfo(this.targets.user, ENV.BUILD_REQUESTEDFOR, true);
  }
}

module.exports = {
  AzureDevOpsCI
}
