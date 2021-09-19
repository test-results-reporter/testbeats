const { mock } = require('pactum');
const assert = require('assert');
const { run } = require('../src/commands/publish');

describe('publish - testng', () => {
  
  it('test-summary for single suite - teams', async () => {
    const id = mock.addInteraction('post test-summary to teams with single suite');
    await run({ config: 'test/data/configs/testng.single-suite.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('test-summary for multiple suites - teams', async () => {
    const id = mock.addInteraction('post test-summary to teams with multiple suites');
    await run({ config: 'test/data/configs/testng.multiple-suites.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('test-summary for single suite - teams with slim report', async () => {
    const id = mock.addInteraction('post test-summary to teams with single suite');
    await run({ config: 'test/data/configs/testng.single-suite.slim.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('test-summary for multiple suites - teams with slim report', async () => {
    const id = mock.addInteraction('post test-summary-slim to teams with multiple suites');
    await run({ config: 'test/data/configs/testng.multiple-suites.slim.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});

describe('publish - junit', () => {

  it('test-summary for multiple suites - teams with slim report', async () => {
    const id = mock.addInteraction('post test-summary to teams with single suite');
    await run({ config: 'test/data/configs/junit.single-suite.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});