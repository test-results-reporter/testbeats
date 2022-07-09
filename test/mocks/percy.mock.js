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

addInteractionHandler('get last build from percy', () => {
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
        ],
        "included": [
          {
            "type": "projects",
            "id": "project-id",
            "attributes": {
              "name": "project-name",
              "full-slug": "org-uid/project-name",
            }
          }
        ]
      }
    }
  }
});

addInteractionHandler('get last build with un-reviewed snapshots from percy', () => {
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
              "total-snapshots-unreviewed": 1,
            }
          }
        ]
      }
    }
  }
});

addInteractionHandler('get empty removed snapshots from percy', () => {
  return {
    request: {
      method: 'GET',
      path: '/api/v1/builds/build-id/removed-snapshots',
      headers: {
        'authorization': 'Token token'
      }
    },
    response: {
      status: 200,
      body: {
        "data": []
      }
    }
  }
});

addInteractionHandler('get removed snapshots from percy', () => {
  return {
    request: {
      method: 'GET',
      path: '/api/v1/builds/build-id/removed-snapshots',
      headers: {
        'authorization': 'Token token'
      }
    },
    response: {
      status: 200,
      body: {
        "data": [
          {
            "type": "snapshots",
            "id": "<snapshot-id>",
            "attributes": {
              "name": "<name>"
            },
            "links": {
              "self": "/api/v1/snapshots/<snapshot-id>"
            }
          },
          {
            "type": "snapshots",
            "id": "<snapshot-id>",
            "attributes": {
              "name": "<name>"
            },
            "links": {
              "self": "/api/v1/snapshots/<snapshot-id>"
            }
          }
        ]
      }
    }
  }
});

addInteractionHandler('get build from percy', () => {
  return {
    request: {
      method: 'GET',
      path: '/api/v1/builds/build-id',
      headers: {
        'authorization': 'Token token'
      }
    },
    response: {
      status: 200,
      body: {
        "data": {
          "id": "build-id",
          "attributes": {
            "state": "finished",
            "total-snapshots": 1,
            "total-snapshots-unreviewed": 0,
          }
        },
        "included": [
          {
            "type": "projects",
            "id": "project-id",
            "attributes": {
              "name": "project-name",
              "full-slug": "org-uid/project-name",
            }
          }
        ]
      }
    }
  }
});