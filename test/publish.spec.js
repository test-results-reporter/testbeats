const { mock } = require('pactum');
const assert = require('assert');
const { run } = require('../src').publish;

describe('publish - testng', () => {
  
  it('test-summary for single suite - teams', async () => {
    const id = mock.addInteraction('post test-summary to teams with single suite');
    await run({ config: 'test/data/configs/testng.single-suite.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('test-summary for multiple suites - teams and slack', async () => {
    const id1 = mock.addInteraction('post test-summary to teams with multiple suites');
    const id2 = mock.addInteraction('post test-summary to slack with multiple suites');
    const id3 = mock.addInteraction('post failure-details to teams with multiple suites');
    const id4 = mock.addInteraction('post failure-details to slack with multiple suites');
    await run({ config: 'test/data/configs/testng.multiple-suites.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
    assert.equal(mock.getInteraction(id4).exercised, true);
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

  it('failure-details for single suite with all tests passed - slack and teams', async () => {
    await run({ config: 'test/data/configs/testng.single-suite.pass.json' });
  });

  it('failure-details for single suite with failures - slack and teams', async () => {
    const id1 = mock.addInteraction('post failure-details to teams with single suite');
    const id2 = mock.addInteraction('post failure-details to slack with single suite');
    await run({ config: 'test/data/configs/testng.single-suite.fail.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  it('test-summary to teams and slack with retries', async () => {
    const id1 = mock.addInteraction('post test-summary to teams with retries');
    const id2 = mock.addInteraction('post test-summary to slack with retries');
    await run({ config: 'test/data/configs/testng.multiple-suites-retries.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
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

  it('failure-*-* for single suite no failures', async () => {
    await run({ config: 'test/data/configs/failure-all-reports-no-failures.json' });
  });

  it('failure-*-* for single suite failures', async () => {
    const id1 = mock.addInteraction('post failure-summary to teams');
    const id2 = mock.addInteraction('post failure-summary to slack');
    const id3 = mock.addInteraction('post failure-summary-slim to teams');
    const id4 = mock.addInteraction('post failure-summary-slim to slack');
    const id5 = mock.addInteraction('post failure-details-slim to teams');
    const id6 = mock.addInteraction('post failure-details-slim to slack');
    await run({ config: 'test/data/configs/failure-all-reports-failures.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
    assert.equal(mock.getInteraction(id4).exercised, true);
    assert.equal(mock.getInteraction(id5).exercised, true);
    assert.equal(mock.getInteraction(id6).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});

describe('publish - custom', () => {

  it('custom target', async () => {
    const id1 = mock.addInteraction('get custom');
    await run({ config: 'test/data/configs/custom-target.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});

describe('publish - report portal analysis', () => {
  
  it('test-summary for single suite - teams', async () => {
    const id1 = mock.addInteraction('get launch details');
    const id2 = mock.addInteraction('post test-summary to teams with report portal analysis');
    const id3 = mock.addInteraction('post test-summary to slack with report portal analysis');
    await run({ config: 'test/data/configs/report-portal-analysis.json' });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.equal(mock.getInteraction(id3).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});