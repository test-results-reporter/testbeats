const { exec } = require('child_process');
const assert = require('assert');
const { mock } = require('pactum');

describe('CLI', () => {

  it('publish results with config file', (done) => {
    mock.addInteraction('post test-summary to slack');
    exec('node src/cli.js publish --config test/data/configs/slack.config.json', (error, stdout, stderr) => {
      console.log(stdout);
      assert.match(stdout, /✅ Results published successfully!/);
      done();
    });
  });

  it('publish results with alias config param', (done) => {
    mock.addInteraction('post test-summary to slack');
    exec('node src/cli.js publish -c test/data/configs/slack.config.json', (error, stdout, stderr) => {
      console.log(stdout);
      assert.match(stdout, /✅ Results published successfully!/);
      done();
    });
  });

  it('publish results with config builder', (done) => {
    mock.addInteraction('post test-summary to slack');
    exec('node src/cli.js publish --slack http://localhost:9393/message --testng test/data/testng/single-suite.xml', (error, stdout, stderr) => {
      console.log(stdout);
      assert.match(stdout, /✅ Results published successfully!/);
      done();
    });
  });

  it('publish results with config builder and extension', (done) => {
    mock.addInteraction('post test-summary to teams with qc-test-summary', { quickChartUrl: "https://quickchart.io" });
    exec('node src/cli.js publish --teams http://localhost:9393/message --testng test/data/testng/single-suite-failures.xml --chart-test-summary', (error, stdout, stderr) => {
      console.log(stdout);
      assert.match(stdout, /✅ Results published successfully!/);
      done();
    });
  });

  it('publish results to beats',  (done) => {
    mock.addInteraction('post test results to beats');
    // mock.addInteraction('get test results from beats');
    mock.addInteraction('post test-summary with beats to teams');
    exec('node src/cli.js publish --api-key api-key --project project-name --run build-name --teams http://localhost:9393/message --testng test/data/testng/single-suite.xml', (error, stdout, stderr) => {
      console.log(stdout);
      assert.match(stdout, /🚀 Publishing results to TestBeats Portal/);
      assert.match(stdout, /✅ Results published successfully!/);
      done();
    });
  });

});;