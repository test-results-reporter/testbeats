const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('targets - github - functional', () => {

  it('should send test-summary', async () => {
    const id = mock.addInteraction('post test-summary to github');
    await publish({
      config: {
        "targets": [
          {
            "name": "github",
            "inputs": {
              "url": "http://localhost:9393",
              "owner": "org",
              "repo": "repo",
              "pull_number": "123",
              "token": "test-token"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/single-suite.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with multiple suites', async () => {
    const id = mock.addInteraction('post test-summary to github with multiple suites');
    await publish({
      config: {
        "targets": [
          {
            "name": "github",
            "inputs": {
              "url": "http://localhost:9393",
              "owner": "test-owner",
              "repo": "test-repo",
              "pull_number": "123",
              "token": "test-token"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/multiple-suites.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary-slim with multiple suites', async () => {
    const id = mock.addInteraction('post test-summary-slim to github with multiple suites');
    await publish({
      config: {
        "targets": [
          {
            "name": "github",
            "inputs": {
              "url": "http://localhost:9393",
              "owner": "test-owner",
              "repo": "test-repo",
              "pull_number": "123",
              "token": "test-token",
              "publish": "test-summary-slim"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/multiple-suites.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send failure-details with multiple suites', async () => {
    const id = mock.addInteraction('post failure-details to github with multiple suites');
    await publish({
      config: {
        "targets": [
          {
            "name": "github",
            "inputs": {
              "url": "http://localhost:9393",
              "owner": "test-owner",
              "repo": "test-repo",
              "pull_number": "123",
              "token": "test-token",
              "publish": "failure-details"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/multiple-suites.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with title', async () => {
    const id = mock.addInteraction('post test-summary to github with title');
    await publish({
      config: {
        "targets": [
          {
            "name": "github",
            "inputs": {
              "url": "http://localhost:9393",
              "owner": "test-owner",
              "repo": "test-repo",
              "pull_number": "123",
              "token": "test-token",
              "title": "Custom Title"
            }
          }
        ],
        "results": [
          {
            "type": "testng",
            "files": [
              "test/data/testng/single-suite.xml"
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

});