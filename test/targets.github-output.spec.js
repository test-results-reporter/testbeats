const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { publish } = require('../src');

describe('targets - github-output', () => {

  let tempOutputFile;

  beforeEach(() => {
    tempOutputFile = path.join(__dirname, `temp-github-output-${Date.now()}.txt`);
  });

  afterEach(() => {
    if (fs.existsSync(tempOutputFile)) {
      fs.unlinkSync(tempOutputFile);
    }
  });

  it('should write test results to github output file', async () => {
    await publish({
      config: {
        targets: [
          {
            name: 'github-output',
            inputs: {
              output_file: tempOutputFile,
              key: 'testbeats'
            }
          }
        ],
        results: [
          {
            type: 'testng',
            files: ['test/data/testng/single-suite.xml']
          }
        ]
      }
    });

    // Verify output file was created
    assert.equal(fs.existsSync(tempOutputFile), true);

    // Read and verify content
    const content = fs.readFileSync(tempOutputFile, 'utf8');
    assert.equal(content.includes('testbeats_results='), true);
    assert.equal(content.includes('testbeats_stores='), true);
  });

});
