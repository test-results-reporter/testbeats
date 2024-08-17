const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('handle errors', () => {

  afterEach(() => {
    mock.clearInteractions();
  });

  it('should send errors to chat', async () => {
    const id = mock.addInteraction('post errors to chat');
    let err;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "chat",
              "inputs": {
                "url": "http://localhost:9393/message"
              }
            }
          ],
          "results": [
            {
              "type": "testng",
              "files": [
                "test/data/testng/invalid.xml"
              ]
            }
          ]
        }
      });
    } catch (e) {
      err = e;
    }
    assert.equal(mock.getInteraction(id).exercised, true);
    assert.ok(err.toString().includes('invalid.xml'));
  });

  it('should send errors to teams', async () => {
    const id = mock.addInteraction('post errors to teams');
    let err;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "teams",
              "inputs": {
                "url": "http://localhost:9393/message"
              }
            }
          ],
          "results": [
            {
              "type": "testng",
              "files": [
                "test/data/testng/invalid.xml"
              ]
            }
          ]
        }
      });
    } catch (e) {
      err = e;
    }
    assert.equal(mock.getInteraction(id).exercised, true);
    assert.ok(err.toString().includes('invalid.xml'));
  });

  it('should send errors to slack', async () => {
    const id = mock.addInteraction('post errors to slack');
    let err;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "slack",
              "inputs": {
                "url": "http://localhost:9393/message"
              }
            }
          ],
          "results": [
            {
              "type": "testng",
              "files": [
                "test/data/testng/invalid.xml"
              ]
            }
          ]
        }
      });
    } catch (e) {
      err = e;
    }
    assert.equal(mock.getInteraction(id).exercised, true);
    assert.ok(err.toString().includes('invalid.xml'));
  });

  it('should send results and errors to chat', async () => {
    const id1 = mock.addInteraction('post test-summary to chat');
    const id2 = mock.addInteraction('post errors to chat');
    let err;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "chat",
              "inputs": {
                "url": "http://localhost:9393/message"
              }
            }
          ],
          "results": [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml",
                "test/data/testng/invalid.xml"
              ]
            }
          ]
        }
      });
    } catch (e) {
      err = e;
    }
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.ok(err.toString().includes('invalid.xml'));
  });

  it('should send results and errors to teams', async () => {
    const id1 = mock.addInteraction('post test-summary to teams');
    const id2 = mock.addInteraction('post errors to teams');
    let err;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "teams",
              "inputs": {
                "url": "http://localhost:9393/message"
              }
            }
          ],
          "results": [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml",
                "test/data/testng/invalid.xml"
              ]
            }
          ]
        }
      });
    } catch (e) {
      err = e;
    }
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.ok(err.toString().includes('invalid.xml'));
  });

  it('should send results and errors to slack', async () => {
    const id1 = mock.addInteraction('post test-summary to slack');
    const id2 = mock.addInteraction('post errors to slack');
    let err;
    try {
      await publish({
        config: {
          "targets": [
            {
              "name": "slack",
              "inputs": {
                "url": "http://localhost:9393/message"
              }
            }
          ],
          "results": [
            {
              "type": "testng",
              "files": [
                "test/data/testng/single-suite.xml",
                "test/data/testng/invalid.xml"
              ]
            }
          ]
        }
      });
    } catch (e) {
      err = e;
    }
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
    assert.ok(err.toString().includes('invalid.xml'));
  });

});