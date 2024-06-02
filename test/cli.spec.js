const { exec } = require('child_process');
const assert = require('assert');
const { mock } = require('pactum');

describe('CLI', () => {

  it('publish results with config file', (done) => {
    mock.addInteraction('post test-summary to slack');
    exec('node src/cli.js publish --config test/data/configs/slack.config.json', (error, stdout, stderr) => {
      assert.match(stdout, /✅ Results published successfully!/);
      done();
    });
  });

  it('publish results with config builder', (done) => {
    mock.addInteraction('post test-summary to slack');
    exec('node src/cli.js publish --slack http://localhost:9393/message --testng test/data/testng/single-suite.xml', (error, stdout, stderr) => {
      assert.match(stdout, /✅ Results published successfully!/);
      done();
    });
  });

  it('publish results with config builder and extension', (done) => {
    mock.addInteraction('post test-summary to teams with qc-test-summary', { quickChartUrl: "https://quickchart.io" });
    exec('node src/cli.js publish --teams http://localhost:9393/message --testng test/data/testng/single-suite-failures.xml --chart-test-summary', (error, stdout, stderr) => {
      assert.match(stdout, /✅ Results published successfully!/);
      done();
    });
  });

});;