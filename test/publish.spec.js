const { mock } = require('pactum');
const assert = require('assert');
const { run } = require('../src/commands/publish');

describe('publish', () => {
  
  it('testng - test-summary - teams', async () => {
    const id = mock.addInteraction('post test-summary to teams');
    await run({ config: 'test/data/configs/default.json' });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

});