const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('get custom', () => {
  return {
    request: {
      method: 'GET',
      path: '/custom'
    },
    response: {
      status: 200
    }
  }
});