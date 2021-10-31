const { mock } = require('pactum');
const assert = require('assert');
const { run } = require('../src/commands/publish');

describe('publish - testng', () => {
  
  it('test-summary for single suite - teams', async () => {
    const id = mock.addInteraction('post test-summary to teams with single suite');
    await run({ config: 'test/data/configs/testng.single-suite.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('test-summary for multiple suites - teams and slack', async () => {
    const id1 = mock.addInteraction('post test-summary to teams with multiple suites');
    const id2 = mock.addInteraction('post test-summary to slack with multiple suites');
    const id3 = mock.addInteraction('post failure-details to slack with multiple suites');
    await run({ config: 'test/data/configs/testng.multiple-suites.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  it('test-summary for single suite - teams with slim report', async () => {
    const id = mock.addInteraction('post test-summary to teams with single suite');
    await run({ config: 'test/data/configs/testng.single-suite.slim.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('test-summary for multiple suites - teams and slack with slim report', async () => {
    const id1 = mock.addInteraction('post test-summary-slim to teams with multiple suites');
    const id2 = mock.addInteraction('post test-summary-slim to slack with multiple suites');
    await run({ config: 'test/data/configs/testng.multiple-suites.slim.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  it('failure-details for single suite with all tests passed - slack', async () => {
    await run({ config: 'test/data/configs/testng.single-suite.pass.json' });
  });

  it('failure-details for single suite with failures - slack', async () => {
    const id1 = mock.addInteraction('post failure-details to slack with single suite');
    await run({ config: 'test/data/configs/testng.single-suite.fail.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});

describe('publish - junit', () => {

  it('test-summary for single suite - teams & slack', async () => {
    const id1 = mock.addInteraction('post test-summary to teams with single suite');
    const id2 = mock.addInteraction('post test-summary to slack with single suite');
    await run({ config: 'test/data/configs/junit.single-suite.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});