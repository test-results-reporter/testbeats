const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require("../src");

describe('TestBeats', () => {

  beforeEach(() => {
    process.env.TEST_BEATS_DELAY = '10';
  });

  afterEach(() => {
    mock.clearInteractions();
  });

  it('should send results to beats', async () => {
    const id1 = mock.addInteraction('post test results to beats');
    const id2 = mock.addInteraction('post test-summary with beats to teams');
    await publish({
      config: {
        api_key: 'api-key',
        project: 'project-name',
        run: 'build-name',
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            }
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
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  it('should send results with failures to beats', async () => {
    const id1 = mock.addInteraction('post test results to beats');
    const id2 = mock.addInteraction('get test results from beats');
    const id3 = mock.addInteraction('post test-summary with beats to teams with ai failure summary');
    await publish({
      config: {
        api_key: 'api-key',
        project: 'project-name',
        run: 'build-name',
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            }
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/single-suite-failures.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('should send results with attachments to beats', async () => {
    const id1 = mock.addInteraction('post test results to beats');
    const id2 = mock.addInteraction('get test results from beats');
    const id3 = mock.addInteraction('upload attachments');
    const id4 = mock.addInteraction('post test-summary to teams with strict as false');
    await publish({
      config: {
        api_key: 'api-key',
        project: 'project-name',
        run: 'build-name',
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            }
          }
        ],
        results: [
          {
            type: 'junit',
            files: [
              'test/data/playwright/junit.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
    assert.equal(mock.getInteraction(id4).exercised, true);
  });

});