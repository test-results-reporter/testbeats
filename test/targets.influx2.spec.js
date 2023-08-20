const { mock, handler } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('targets - influx2 - performance', () => {

  it('should save results', async () => {
    const id =  mock.addInteraction('save perf results to influx2');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "influx2",
                "inputs": {
                  "url": "http://localhost:9393",
                  "token": "testtoken",
                  "organization": "testorg",
                  "bucket": "testbucket",
                  "precision": "ns",
                  "gzipTransport": false // Turn off the compression, so we can match the write queries
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

  it('should save results with custom tags and fields', async () => {
    const id = mock.addInteraction('save perf results with custom tags and fields to influx2');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "influx2",
                "inputs": {
                  "url": "http://localhost:9393",
                  "token": "testtoken",
                  "organization": "testorg",
                  "bucket": "testbucket",
                  "precision": "ns",
                  "tags": {
                    "Team": "QA",
                    "App": "PactumJS"
                  },
                  "fields": {
                    "id": 123,
                  },
                  "gzipTransport": false // Turn off the compression, so we can match the write queries
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

describe('targets - influx2 - functional', () => {

  it('should save results', async () => {
    const id = mock.addInteraction('save test results to influx2');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "influx2",
                "inputs": {
                  "url": "http://localhost:9393",
                  "token": "testtoken",
                  "organization": "testorg",
                  "bucket": "testbucket",
                  "precision": "ns",
                  "gzipTransport": false // Turn off the compression, so we can match the write queries
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
    const id = mock.addInteraction('save test results with custom tags and fields to influx2');
    await publish({
      config: {
        "reports": [
          {
            "targets": [
              {
                "name": "influx2",
                "inputs": {
                  "url": "http://localhost:9393",
                  "token": "testtoken",
                  "organization": "testorg",
                  "bucket": "testbucket",
                  "precision": "ns",
                  "tags": {
                    "Team": "QA",
                    "App": "PactumJS"
                  },
                  "fields": {
                    "id": 123,
                    "stringfield": "coolvalue"
                  },
                  "gzipTransport": false // Turn off the compression, so we can match the write queries
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