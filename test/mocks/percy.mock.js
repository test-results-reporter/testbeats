const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('get percy project', () => {
  return {
    request: {
      method: 'GET',
      path: '/api/v1/projects',
      form: {
        'project_slug': 'project-name'
      },
      headers: {
        'authorization': 'Token token'
      }
    },
    response: {
      status: 200,
      body: {
        "data": {
          "id": "project-id",
          "attributes": {
            "full-slug": "org-uid/project-name",
          }
        }
      }
    }
  }
});

addInteractionHandler('get last build in percy', () => {
  return {
    request: {
      method: 'GET',
      path: '/api/v1/builds',
      queryParams: {
        'project_id': 'project-id',
        'page[limit]': '1'
      },
      headers: {
        'authorization': 'Token token'
      }
    },
    response: {
      status: 200,
      body: {
        "data": [
          {
            "id": "build-id",
            "attributes": {
              "state": "finished",
              "total-snapshots": 1,
              "total-snapshots-unreviewed": 0,
            }
          }
        ]
      }
    }
  }
});