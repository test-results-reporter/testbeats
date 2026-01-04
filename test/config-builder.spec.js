const assert = require('assert');
const path = require('path');
const { ConfigBuilder } = require('../src/utils/config.builder');

function normalizePath(p) {
  // Remove drive letter on Windows (e.g., 'C:\' -> '\')
  let normalized = p.replace(/^[A-Za-z]:/, '');
  // Convert all backslashes to forward slashes
  normalized = normalized.split(path.sep).join('/');
  return normalized;
}

describe('ConfigBuilder', () => {

  it('should build config from object with beats info', () => {
    const opts = {
      config: {
        project: 'test-project',
        run: 'test-run',
        api_key: 'test-key',
        results: [{ type: 'junit', files: ['test.xml'] }]
      }
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.project, 'test-project');
    assert.equal(builder.config.run, 'test-run');
    assert.equal(builder.config.api_key, 'test-key');
  });

  it('should override config project with opts.project', () => {
    const opts = {
      project: 'cli-project',
      config: {
        project: 'config-project',
        results: [{ type: 'junit', files: ['test.xml'] }]
      }
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.project, 'cli-project');
  });

  it('should override config run with opts.run', () => {
    const opts = {
      run: 'cli-run',
      config: {
        run: 'config-run',
        results: [{ type: 'junit', files: ['test.xml'] }]
      }
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.run, 'cli-run');
  });

  it('should override config api_key with opts.api-key', () => {
    const opts = {
      'api-key': 'cli-key',
      config: {
        api_key: 'config-key',
        results: [{ type: 'junit', files: ['test.xml'] }]
      }
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.api_key, 'cli-key');
  });

  it('should build config from file path', () => {
    const opts = {
      config: './test/data/configs/slack.config.json'
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config);
    assert.ok(builder.config.results);
    assert.ok(builder.config.targets);
  });

  it('should throw error for invalid file path', () => {
    const opts = {
      config: './invalid-path.json'
    };
    const builder = new ConfigBuilder(opts, null);

    assert.throws(() => builder.build(), /Failed to read config file/);
  });

  it('should build config from command line options', () => {
    const opts = {
      project: 'cli-project',
      run: 'cli-run',
      'api-key': 'cli-key',
      junit: 'results/junit.xml',
      slack: 'https://hooks.slack.com/test'
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.project, 'cli-project');
    assert.equal(builder.config.run, 'cli-run');
    assert.equal(builder.config.api_key, 'cli-key');
    assert.ok(builder.config.results);
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.results[0].type, 'junit');
    assert.ok(builder.config.targets);
    assert.equal(builder.config.targets.length, 1);
    assert.equal(builder.config.targets[0].name, 'slack');
  });

  it('should use opts.project when provided', () => {
    const opts = { project: 'cli-project' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.project, 'cli-project');
  });

  it('should use TEST_BEATS_PROJECT env var when opts.project not provided', () => {
    const opts = {};
    const env = { TEST_BEATS_PROJECT: 'env-project' };
    const builder = new ConfigBuilder(opts, null, env);
    builder.build();

    assert.equal(builder.config.project, 'env-project');
  });

  it('should use TESTBEATS_PROJECT env var when TEST_BEATS_PROJECT not provided', () => {
    const opts = {};
    const env = { TESTBEATS_PROJECT: 'testbeats-project' };
    const builder = new ConfigBuilder(opts, null, env);
    builder.build();

    assert.equal(builder.config.project, 'testbeats-project');
  });

  it('should prefer TEST_BEATS_PROJECT over TESTBEATS_PROJECT', () => {
    const opts = {};
    const env = {
      TEST_BEATS_PROJECT: 'test-beats-project',
      TESTBEATS_PROJECT: 'testbeats-project'
    };
    const builder = new ConfigBuilder(opts, null, env);
    builder.build();

    assert.equal(builder.config.project, 'test-beats-project');
  });

  it('should use config.project when already set and no opts/env provided', () => {
    const opts = { config: { project: 'config-project' } };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.project, 'config-project');
  });

  it('should use ci.repository_name when no other source provided', () => {
    const opts = {};
    const ci = { repository_name: 'ci-repo' };
    const builder = new ConfigBuilder(opts, ci);
    builder.build();

    assert.equal(builder.config.project, 'ci-repo');
  });

  it('should use default project when no source provided', () => {
    const opts = {};
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.project, 'demo-project');
  });

  it('should use opts.run when provided', () => {
    const opts = { run: 'cli-run' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.run, 'cli-run');
  });

  it('should use TEST_BEATS_RUN env var when opts.run not provided', () => {
    const opts = {};
    const env = { TEST_BEATS_RUN: 'env-run' };
    const builder = new ConfigBuilder(opts, null, env);
    builder.build();

    assert.equal(builder.config.run, 'env-run');
  });

  it('should use TESTBEATS_RUN env var when TEST_BEATS_RUN not provided', () => {
    const opts = {};
    const env = { TESTBEATS_RUN: 'testbeats-run' };
    const builder = new ConfigBuilder(opts, null, env);
    builder.build();

    assert.equal(builder.config.run, 'testbeats-run');
  });

  it('should prefer TEST_BEATS_RUN over TESTBEATS_RUN', () => {
    const opts = {};
    const env = {
      TEST_BEATS_RUN: 'test-beats-run',
      TESTBEATS_RUN: 'testbeats-run'
    };
    const builder = new ConfigBuilder(opts, null, env);
    builder.build();

    assert.equal(builder.config.run, 'test-beats-run');
  });

  it('should use config.run when already set and no opts/env provided', () => {
    const opts = { config: { run: 'config-run' } };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.run, 'config-run');
  });

  it('should use ci.build_name when no other source provided', () => {
    const opts = {};
    const ci = { build_name: 'ci-build' };
    const builder = new ConfigBuilder(opts, ci);
    builder.build();

    assert.equal(builder.config.run, 'ci-build');
  });

  it('should not set run when no source provided', () => {
    const opts = {};
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.run, undefined);
  });

  it('should use opts.api-key when provided', () => {
    const opts = { 'api-key': 'cli-key' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.api_key, 'cli-key');
  });

  it('should use TEST_BEATS_API_KEY env var when opts.api-key not provided', () => {
    const opts = {};
    const env = { TEST_BEATS_API_KEY: 'env-key' };
    const builder = new ConfigBuilder(opts, null, env);
    builder.build();

    assert.equal(builder.config.api_key, 'env-key');
  });

  it('should use TESTBEATS_API_KEY env var when TEST_BEATS_API_KEY not provided', () => {
    const opts = {};
    const env = { TESTBEATS_API_KEY: 'testbeats-key' };
    const builder = new ConfigBuilder(opts, null, env);
    builder.build();

    assert.equal(builder.config.api_key, 'testbeats-key');
  });

  it('should prefer TEST_BEATS_API_KEY over TESTBEATS_API_KEY', () => {
    const opts = {};
    const env = {
      TEST_BEATS_API_KEY: 'test-beats-key',
      TESTBEATS_API_KEY: 'testbeats-key'
    };
    const builder = new ConfigBuilder(opts, null, env);
    builder.build();

    assert.equal(builder.config.api_key, 'test-beats-key');
  });

  it('should not set api_key when no source provided', () => {
    const opts = {};
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.api_key, undefined);
  });

  it('should add junit results', () => {
    const opts = { junit: 'results/junit.xml' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.results);
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.results[0].type, 'junit');
    assert.deepEqual(builder.config.results[0].files.map(normalizePath), ['results/junit.xml']);
  });

  it('should add testng results', () => {
    const opts = { testng: 'results/testng.xml' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.results);
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.results[0].type, 'testng');
    assert.deepEqual(builder.config.results[0].files.map(normalizePath), ['results/testng.xml']);
  });

  it('should add cucumber results', () => {
    const opts = { cucumber: 'results/cucumber.json' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.results);
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.results[0].type, 'cucumber');
    assert.deepEqual(builder.config.results[0].files.map(normalizePath), ['results/cucumber.json']);
  });

  it('should add mocha results', () => {
    const opts = { mocha: 'results/mocha.json' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.results);
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.results[0].type, 'mocha');
    assert.deepEqual(builder.config.results[0].files.map(normalizePath), ['results/mocha.json']);
  });

  it('should add nunit results', () => {
    const opts = { nunit: 'results/nunit.xml' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.results);
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.results[0].type, 'nunit');
    assert.deepEqual(builder.config.results[0].files.map(normalizePath), ['results/nunit.xml']);
  });

  it('should add xunit results', () => {
    const opts = { xunit: 'results/xunit.xml' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.results);
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.results[0].type, 'xunit');
    assert.deepEqual(builder.config.results[0].files.map(normalizePath), ['results/xunit.xml']);
  });

  it('should add mstest results', () => {
    const opts = { mstest: 'results/mstest.trx' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.results);
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.results[0].type, 'mstest');
    assert.deepEqual(builder.config.results[0].files.map(normalizePath), ['results/mstest.trx']);
  });

  it('should override results when multiple result types provided (last wins)', () => {
    const opts = {
      junit: 'results/junit.xml',
      testng: 'results/testng.xml'
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.results);
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.results[0].type, 'testng');
  });

  it('should add slack target', () => {
    const opts = { slack: 'https://hooks.slack.com/test' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.targets);
    assert.equal(builder.config.targets.length, 1);
    assert.equal(builder.config.targets[0].name, 'slack');
    assert.equal(builder.config.targets[0].inputs.url, 'https://hooks.slack.com/test');
    assert.equal(builder.config.targets[0].inputs.title, '');
    assert.equal(builder.config.targets[0].inputs.only_failures, true);
  });

  it('should add teams target', () => {
    const opts = { teams: 'https://outlook.office.com/webhook/test' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.targets);
    assert.equal(builder.config.targets.length, 1);
    assert.equal(builder.config.targets[0].name, 'teams');
    assert.equal(builder.config.targets[0].inputs.url, 'https://outlook.office.com/webhook/test');
    assert.equal(builder.config.targets[0].inputs.title, '');
    assert.equal(builder.config.targets[0].inputs.only_failures, true);
  });

  it('should add chat target', () => {
    const opts = { chat: 'https://chat.googleapis.com/v1/spaces/test' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.targets);
    assert.equal(builder.config.targets.length, 1);
    assert.equal(builder.config.targets[0].name, 'chat');
    assert.equal(builder.config.targets[0].inputs.url, 'https://chat.googleapis.com/v1/spaces/test');
    assert.equal(builder.config.targets[0].inputs.title, '');
    assert.equal(builder.config.targets[0].inputs.only_failures, true);
  });

  it('should add github target with token', () => {
    const opts = { github: 'ghp_test_token' };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.targets);
    assert.equal(builder.config.targets.length, 1);
    assert.equal(builder.config.targets[0].name, 'github');
    assert.equal(builder.config.targets[0].inputs.token, 'ghp_test_token');
    assert.equal(builder.config.targets[0].inputs.title, '');
    assert.equal(builder.config.targets[0].inputs.only_failures, true);
  });

  it('should add multiple targets', () => {
    const opts = {
      slack: 'https://hooks.slack.com/test',
      teams: 'https://outlook.office.com/webhook/test'
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.targets);
    assert.equal(builder.config.targets.length, 2);
    assert.equal(builder.config.targets[0].name, 'slack');
    assert.equal(builder.config.targets[1].name, 'teams');
  });

  it('should use custom title when provided', () => {
    const opts = {
      title: 'Custom Test Report',
      slack: 'https://hooks.slack.com/test'
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.targets[0].inputs.title, 'Custom Test Report');
  });

  it('should add ci-info extension', () => {
    const opts = { 'ci-info': true };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.extensions);
    assert.equal(builder.config.extensions.length, 1);
    assert.equal(builder.config.extensions[0].name, 'ci-info');
  });

  it('should add quick-chart-test-summary extension', () => {
    const opts = { 'chart-test-summary': true };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.extensions);
    assert.equal(builder.config.extensions.length, 1);
    assert.equal(builder.config.extensions[0].name, 'quick-chart-test-summary');
  });

  it('should add multiple extensions', () => {
    const opts = {
      'ci-info': true,
      'chart-test-summary': true
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.ok(builder.config.extensions);
    assert.equal(builder.config.extensions.length, 2);
    assert.equal(builder.config.extensions[0].name, 'ci-info');
    assert.equal(builder.config.extensions[1].name, 'quick-chart-test-summary');
  });

  it('should return undefined when opts is null', () => {
    const builder = new ConfigBuilder(null, null);
    const result = builder.build();

    assert.equal(result, undefined);
  });

  it('should return undefined when opts is undefined', () => {
    const builder = new ConfigBuilder(undefined, null);
    const result = builder.build();

    assert.equal(result, undefined);
  });

  it('should build complete config from CLI options', () => {
    const opts = {
      project: 'my-project',
      run: 'build-123',
      'api-key': 'secret-key',
      junit: 'results/junit.xml',
      slack: 'https://hooks.slack.com/test',
      teams: 'https://outlook.office.com/webhook/test',
      title: 'Test Results',
      'ci-info': true,
      'chart-test-summary': true
    };
    const builder = new ConfigBuilder(opts, null);
    builder.build();

    assert.equal(builder.config.project, 'my-project');
    assert.equal(builder.config.run, 'build-123');
    assert.equal(builder.config.api_key, 'secret-key');
    assert.equal(builder.config.results.length, 1);
    assert.equal(builder.config.targets.length, 2);
    assert.equal(builder.config.extensions.length, 2);
  });

  it('should build config with CI info', () => {
    const opts = { junit: 'results/junit.xml' };
    const ci = {
      repository_name: 'test-repo',
      build_name: 'build-456'
    };
    const builder = new ConfigBuilder(opts, ci);
    builder.build();

    assert.equal(builder.config.project, 'test-repo');
    assert.equal(builder.config.run, 'build-456');
  });

  it('should prioritize opts over env over ci', () => {
    const opts = {
      project: 'opts-project',
      run: 'opts-run'
    };
    const ci = {
      repository_name: 'ci-repo',
      build_name: 'ci-build'
    };
    const env = {
      TEST_BEATS_PROJECT: 'env-project',
      TEST_BEATS_RUN: 'env-run'
    };
    const builder = new ConfigBuilder(opts, ci, env);
    builder.build();

    assert.equal(builder.config.project, 'opts-project');
    assert.equal(builder.config.run, 'opts-run');
  });

});
