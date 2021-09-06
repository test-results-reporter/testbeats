const { mock } = require('pactum');
const assert = require('assert');
const { run } = require('../src/commands/publish');

describe('publish', () => {
  
  it('testng - test-summary for single suite - teams', async () => {
    const id = mock.addInteraction('post test-summary to teams with single suite');
    await run({ config: 'test/data/configs/testng.single-suite.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('testng - test-summary for multiple suites - teams', async () => {
    const id = mock.addInteraction('post test-summary to teams with multiple suites');
    await run({ config: 'test/data/configs/testng.multiple-suites.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

});