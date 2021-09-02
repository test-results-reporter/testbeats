const { mock } = require('pactum');

before(async () => {
  await mock.start();
  require('./helpers/interactions');
});

after(async () => {
  await mock.stop();
});