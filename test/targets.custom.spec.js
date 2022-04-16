const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('targets - custom', () => {

  it('custom target', async () => {
    const id1 = mock.addInteraction('get custom');
    await publish({
      config: 'test/data/configs/custom-target.json'
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});