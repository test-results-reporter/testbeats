const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('get launch details', () => {
  return {
    request: {
      method: 'GET',
      path: '/api/v1/project-name/launch/id123',
      headers: {
        "authorization": "Bearer abc"
      }
    },
    response: {
      status: 200,
      body: {
        "statistics": {
          "defects": {
            "to_investigate": {
              "total": 4,
              "ti001": 4
            }
          }
        }
      }
    }
  }
});