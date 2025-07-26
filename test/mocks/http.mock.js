const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('http', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/test',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    response: {
      status: 200,
    }
  }
});