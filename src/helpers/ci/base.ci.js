const os = require('os');
const pkg = require('../../../package.json');

const ENV = process.env;

class BaseCI {
  ci = '';
  git = '';
  repository_url = '';
  repository_name = '';
  repository_ref = '';
  repository_commit_sha = '';
  branch_url = '';
  branch_name = '';
  pull_request_url = '';
  pull_request_name = '';
  build_url = '';
  build_number = '';
  build_name = '';
  build_reason = '';
  user = '';
  runtime = '';
  runtime_version = '';
  os = '';
  os_version = '';
  testbeats_version = '';

  targets = {
    ci: 'ci',
    git: 'git',
    repository_url: 'repository_url',
    repository_name: 'repository_name',
    repository_ref: 'repository_ref',
    repository_commit_sha: 'repository_commit_sha',
    branch_url: 'branch_url',
    branch_name: 'branch_name',
    pull_request_url: 'pull_request_url',
    pull_request_name: 'pull_request_name',
    build_url: 'build_url',
    build_number: 'build_number',
    build_name: 'build_name',
    build_reason: 'build_reason',
    user: 'user',
    runtime: 'runtime',
    runtime_version: 'runtime_version',
    os: 'os',
    os_version: 'os_version',
    testbeats_version: 'testbeats_version'
  }

  constructor() {
    this.setDefaultInformation();
  }

  setDefaultInformation() {
    this.ci = ENV.TEST_BEATS_CI_NAME;
    this.git = ENV.TEST_BEATS_CI_GIT;
    this.repository_url = ENV.TEST_BEATS_CI_REPOSITORY_URL;
    this.repository_name = ENV.TEST_BEATS_CI_REPOSITORY_NAME;
    this.repository_ref = ENV.TEST_BEATS_CI_REPOSITORY_REF;
    this.repository_commit_sha = ENV.TEST_BEATS_CI_REPOSITORY_COMMIT_SHA;
    this.branch_url = ENV.TEST_BEATS_BRANCH_URL;
    this.branch_name = ENV.TEST_BEATS_BRANCH_NAME;
    this.pull_request_url = ENV.TEST_BEATS_PULL_REQUEST_URL;
    this.pull_request_name = ENV.TEST_BEATS_PULL_REQUEST_NAME;
    this.build_url = ENV.TEST_BEATS_CI_BUILD_URL;
    this.build_number = ENV.TEST_BEATS_CI_BUILD_NUMBER;
    this.build_name = ENV.TEST_BEATS_CI_BUILD_NAME;
    this.build_reason = ENV.TEST_BEATS_CI_BUILD_REASON;
    this.user = ENV.TEST_BEATS_CI_USER || os.userInfo().username;

    const runtime = this.#getRuntimeInfo();
    this.runtime = runtime.name;
    this.runtime_version = runtime.version;
    this.os = os.platform();
    this.os_version = os.release();
    this.testbeats_version = pkg.version;

  }

  #getRuntimeInfo() {
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      return { name: 'node', version: process.versions.node };
    } else if (typeof Deno !== 'undefined') {
      return { name: 'deno', version: Deno.version.deno };
    } else if (typeof Bun !== 'undefined') {
      return { name: 'bun', version: Bun.version };
    } else {
      return { name: 'unknown', version: 'unknown' };
    }
  }

  setInfo(target, value, force = false) {
    if (force && value) {
      this[target] = value;
      return;
    }
    if (!this[target]) {
      this[target] = value;
    }
  }

 /**
  *
  * @returns {import('../../extensions/extensions').ICIInfo}
  */
  info() {
    return {
      ci: this.ci,
      git: this.git,
      repository_url: this.repository_url,
      repository_name: this.repository_name,
      repository_ref: this.repository_ref,
      repository_commit_sha: this.repository_commit_sha,
      branch_url: this.branch_url,
      branch_name: this.branch_name,
      pull_request_url: this.pull_request_url,
      pull_request_name: this.pull_request_name,
      build_url: this.build_url,
      build_number: this.build_number,
      build_name: this.build_name,
      build_reason: this.build_reason,
      user: this.user,
      runtime: this.runtime,
      runtime_version: this.runtime_version,
      os: this.os,
      os_version: this.os_version,
      testbeats_version: this.testbeats_version
    }
  }

}

module.exports = { BaseCI };