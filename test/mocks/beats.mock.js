const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('post test results to testbeats', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/core/v1/test-runs'
    },
    response: {
      status: 200,
      body: {
        id: 'test-run-id'
      }
    }
  }
});