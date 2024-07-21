const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - ci-info', () => {

  beforeEach(() => {
    process.env.GITHUB_ACTIONS = '';
    process.env.GITHUB_SERVER_URL = '';
    process.env.GITHUB_REPOSITORY = '';
    process.env.GITHUB_REF = '';
    process.env.GITHUB_SHA = '';
    process.env.GITHUB_RUN_ID = '';
    process.env.GITHUB_RUN_NUMBER = '';
    process.env.GITHUB_WORKFLOW = '';

    process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI = '';
    process.env.BUILD_REPOSITORY_URI = '';
    process.env.BUILD_REPOSITORY_NAME = '';
    process.env.BUILD_SOURCEBRANCH = '';
    process.env.BUILD_SOURCEVERSION = '';
    process.env.BUILD_BUILDID = '';
    process.env.BUILD_BUILDNUMBER = '';
    process.env.BUILD_DEFINITIONNAME = '';
  });

  it('should send test-summary with ci-info to teams with no ci information', async () => {
    const id = mock.addInteraction('post test-summary to teams');
    await publish({
      config: {
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/single-suite.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with build details when branch is a common branch', async () => {
    process.env.GITHUB_ACTIONS = 'GITHUB_ACTIONS';
    process.env.GITHUB_SERVER_URL = 'https://github.com';
    process.env.GITHUB_REPOSITORY = 'test/test';
    process.env.GITHUB_REF = 'refs/heads/master';
    process.env.GITHUB_SHA = 'sha';
    process.env.GITHUB_RUN_ID = 'id-123';
    process.env.GITHUB_RUN_NUMBER = 'number-123';
    process.env.GITHUB_WORKFLOW = 'Build';

    const id = mock.addInteraction('post test-summary with only build ci-info to teams');
    await publish({
      config: {
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/single-suite.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with github ci information to teams', async () => {
    process.env.GITHUB_ACTIONS = 'GITHUB_ACTIONS';
    process.env.GITHUB_SERVER_URL = 'https://github.com';
    process.env.GITHUB_REPOSITORY = 'test/test';
    process.env.GITHUB_REF = 'refs/heads/feature-test';
    process.env.GITHUB_SHA = 'sha';
    process.env.GITHUB_RUN_ID = 'id-123';
    process.env.GITHUB_RUN_NUMBER = 'number-123';
    process.env.GITHUB_WORKFLOW = 'Build';
    const id = mock.addInteraction('post test-summary with ci-info to teams');
    await publish({
      config: {
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/single-suite.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with azure devops ci information to slack', async () => {
    process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI = 'https://dev.azure.com/';
    process.env.SYSTEM_TEAMPROJECT = 'test';
    process.env.BUILD_REPOSITORY_URI = 'https://github.com/test/test';
    process.env.BUILD_REPOSITORY_NAME = 'test/test';
    process.env.BUILD_SOURCEBRANCH = 'refs/pull/123/merge';
    process.env.BUILD_SOURCEVERSION = 'sha';
    process.env.BUILD_BUILDID = 'id-123';
    process.env.BUILD_BUILDNUMBER = 'number-123';
    process.env.BUILD_DEFINITIONNAME = 'Build';
    const id = mock.addInteraction('post test-summary with ci-info to slack');
    await publish({
      config: {
        targets: [
          {
            name: 'slack',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/single-suite.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with azure devops ci information to chat and extra data', async () => {
    process.env.GITHUB_ACTIONS = 'GITHUB_ACTIONS';
    process.env.GITHUB_SERVER_URL = 'https://github.com';
    process.env.GITHUB_REPOSITORY = 'org/repo';
    process.env.GITHUB_REF = 'refs/heads/feature-test';
    process.env.GITHUB_SHA = 'sha';
    process.env.GITHUB_RUN_ID = 'id-123';
    process.env.GITHUB_RUN_NUMBER = 'number-123';
    process.env.GITHUB_WORKFLOW = 'Build';
    const id = mock.addInteraction('post test-summary with ci-info to chat');
    await publish({
      config: {
        targets: [
          {
            name: 'chat',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info',
                inputs: {
                  data: [
                    {
                      "key": "Download Logs",
                      "value": "{LOGS_URL}",
                      "type": "hyperlink"
                    }
                  ]
                }
              }
            ]
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/single-suite.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with multiple suites and ci information to slack', async () => {
    process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI = 'https://dev.azure.com/';
    process.env.SYSTEM_TEAMPROJECT = 'test';
    process.env.BUILD_REPOSITORY_URI = 'https://github.com/test/test';
    process.env.BUILD_REPOSITORY_NAME = 'test/test';
    process.env.BUILD_SOURCEBRANCH = 'refs/pull/123/merge';
    process.env.BUILD_SOURCEVERSION = 'sha';
    process.env.BUILD_BUILDID = 'id-123';
    process.env.BUILD_BUILDNUMBER = 'number-123';
    process.env.BUILD_DEFINITIONNAME = 'Build';
    const id = mock.addInteraction('post test-summary with multiple suites and ci-info to to slack');
    await publish({
      config: {
        targets: [
          {
            name: 'slack',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/multiple-suites.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});