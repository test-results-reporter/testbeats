const { mock } = require('pactum');

before(async () => {
  await mock.start();
  // require('./helpers/interactions');
  require('./mocks');
});

after(async () => {
  await mock.stop();
});