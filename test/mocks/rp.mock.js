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

addInteractionHandler('get last launch details', () => {
  return {
    request: {
      method: 'GET',
      path: '/api/v1/project-name/launch',
      queryParams: {
        "filter.eq.name": "smoke",
        "page.size": "1",
        "page.sort": "startTime,desc"
      },
      headers: {
        "authorization": "Bearer abc"
      }
    },
    response: {
      status: 200,
      body: {
        "content": [
          {
            "id": "id123",
            "statistics": {
              "defects": {
                "to_investigate": {
                  "total": 4,
                  "ti001": 4
                }
              }
            }
          }
        ]
      }
    }
  }
});