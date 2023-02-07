const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('targets - influx - performance', () => {

  it('should save results', async () => {
    const id = mock.addInteraction('save perf results');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "influx",
                "inputs": {
                  "url": "http://localhost:9393",
                  "db": "TestResults",
                  "username": "user",
                  "password": "pass"
                }
              }
            ],
            "results": [
              {
                "type": "jmeter",
                "files": [
                  "test/data/jmeter/sample.csv"
                ]
              }
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should save results with custom tags', async () => {
    const id = mock.addInteraction('save perf results with custom tags and fields');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "influx",
                "inputs": {
                  "url": "http://localhost:9393",
                  "db": "TestResults",
                  "username": "user",
                  "password": "pass",
                  "tags": {
                    "Team": "QA",
                    "App": "PactumJS"
                  },
                  "fields": {
                    "id": "123",
                  }
                }
              }
            ],
            "results": [
              {
                "type": "jmeter",
                "files": [
                  "test/data/jmeter/sample.csv"
                ]
              }
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

describe('targets - influx - functional', () => {

  it('should save results', async () => {
    const id = mock.addInteraction('save test results');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "influx",
                "inputs": {
                  "url": "http://localhost:9393",
                  "db": "TestResults",
                  "username": "user",
                  "password": "pass"
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
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should save results with custom tags and fields', async () => {
    const id = mock.addInteraction('save test results with custom tags and fields');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "influx",
                "inputs": {
                  "url": "http://localhost:9393",
                  "db": "TestResults",
                  "username": "user",
                  "password": "pass",
                  "tags": {
                    "Team": "QA",
                    "App": "PactumJS"
                  },
                  "fields": {
                    "id": "123",
                  }
                }
              }
            ],
            "results": [
              {
                "type": "testng",
                "files": [
                  "test/data/testng/multiple-suites-failures.xml"
                ]
              }
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