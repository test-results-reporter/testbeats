const { mock } = require('pactum');

before(async () => {
  await mock.start();
  // require('./helpers/interactions');
  require('./mocks');
  process.env.TEST_BEATS_URL = 'http://localhost:9393';
});

after(async () => {
  await mock.stop();
});