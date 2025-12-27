const { ManualTestSynchronizer } = require('../src/manual/synchronizer');
const assert = require('assert');

function createMockBeatsApi(options = {}) {
  const {
    syncManualFoldersResponse = { results: [] },
    syncManualTestSuitesResponse = { results: [] },
    syncManualFoldersError = null,
    syncManualTestSuitesError = null
  } = options;

  return {
    syncManualFolders: async (payload) => {
      if (syncManualFoldersError) {
        throw syncManualFoldersError;
      }
      if (typeof syncManualFoldersResponse === 'function') {
        return syncManualFoldersResponse(payload);
      }
      return syncManualFoldersResponse;
    },
    syncManualTestSuites: async (payload) => {
      if (syncManualTestSuitesError) {
        throw syncManualTestSuitesError;
      }
      if (typeof syncManualTestSuitesResponse === 'function') {
        return syncManualTestSuitesResponse(payload);
      }
      return syncManualTestSuitesResponse;
    }
  };
}

describe('ManualTestSynchronizer', () => {
  it('should sync structure successfully and return result', async () => {
      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'test-folder', id: 'folder-123' }
          ]
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.foldersProcessed, 1);
      assert.strictEqual(result.testSuitesProcessed, 0);
      assert.strictEqual(result.errors.length, 0);
    });

    it('should return success false when errors occur', async () => {
      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: false, name: 'test-folder', error: 'Sync failed' }
          ]
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.foldersProcessed, 0);
      assert.strictEqual(result.errors.length, 1);
      assert.strictEqual(result.errors[0].type, 'folder');
      assert.strictEqual(result.errors[0].name, 'test-folder');
      assert.strictEqual(result.errors[0].error, 'Sync failed');
    });

    it('should handle empty folder structure', async () => {
      const mockBeatsApi = createMockBeatsApi();
      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: []
      };

      const compareResult = {
        folders: []
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.foldersProcessed, 0);
      assert.strictEqual(result.testSuitesProcessed, 0);
      assert.strictEqual(result.errors.length, 0);
    });

    it('should enrich local folders with server metadata', async () => {
      let capturedPayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: (payload) => {
          capturedPayload = payload;
          return {
            results: [
              { success: true, name: 'test-folder', id: 'server-id-123' }
            ]
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'local-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'update',
            name: 'test-folder',
            hash: 'local-hash',
            id: 'existing-id-456',
            test_suites: [],
            folders: []
          }
        ]
      };

      await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(capturedPayload.folders[0].type, 'update');
      assert.strictEqual(capturedPayload.folders[0].id, 'existing-id-456');
      assert.strictEqual(capturedPayload.folders[0].name, 'test-folder');
    });

  it('should send correct payload to API', async () => {
      let capturedPayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: (payload) => {
          capturedPayload = payload;
          return {
            results: [
              { success: true, name: 'test-folder', id: 'folder-123' }
            ]
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      await synchronizer.sync(structure, compareResult, 'project-456');

      assert.strictEqual(capturedPayload.project_id, 'project-456');
      assert.strictEqual(capturedPayload.folders.length, 1);
      assert.strictEqual(capturedPayload.folders[0].type, 'create');
      assert.strictEqual(capturedPayload.folders[0].name, 'test-folder');
      assert.strictEqual(capturedPayload.folders[0].hash, 'folder-hash');
    });

    it('should update folder IDs after creation', async () => {
      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'new-folder', id: 'created-id-789' }
          ]
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'new-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'new-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      // The folder should be synced successfully and the ID is used internally
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.foldersProcessed, 1);
    });

    it('should set parent_folder_id on subfolders', async () => {
      let parentPayload = null;
      let subfolderPayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: (payload) => {
          if (!parentPayload) {
            parentPayload = payload;
            return {
              results: [
                { success: true, name: 'parent-folder', id: 'parent-id-123' }
              ]
            };
          } else {
            subfolderPayload = payload;
            return {
              results: [
                { success: true, name: 'sub-folder', id: 'sub-id-456' }
              ]
            };
          }
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'parent-folder',
            hash: 'parent-hash',
            test_suites: [],
            folders: [
              {
                name: 'sub-folder',
                hash: 'sub-hash',
                test_suites: [],
                folders: []
              }
            ]
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'parent-folder',
            hash: 'parent-hash',
            test_suites: [],
            folders: [
              {
                type: 'create',
                name: 'sub-folder',
                hash: 'sub-hash',
                test_suites: [],
                folders: []
              }
            ]
          }
        ]
      };

      await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(subfolderPayload.folders[0].parent_folder_id, 'parent-id-123');
    });

    it('should sync test suites after folder sync', async () => {
      let folderPayload = null;
      let testSuitePayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: (payload) => {
          folderPayload = payload;
          return {
            results: [
              { success: true, name: 'test-folder', id: 'folder-id-123' }
            ]
          };
        },
        syncManualTestSuitesResponse: (payload) => {
          testSuitePayload = payload;
          return {
            results: [
              { success: true, name: 'Test Suite' }
            ]
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                name: 'Test Suite',
                hash: 'suite-hash',
                type: 'feature',
                tags: ['@smoke'],
                before_each: [],
                test_cases: []
              }
            ],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                type: 'create',
                name: 'Test Suite',
                hash: 'suite-hash'
              }
            ],
            folders: []
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      assert.ok(testSuitePayload);
      assert.strictEqual(testSuitePayload.suites[0].folder_id, 'folder-id-123');
      assert.strictEqual(result.testSuitesProcessed, 1);
    });

    it('should handle folder sync failures and collect errors', async () => {
      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: false, name: 'failed-folder', error: 'Permission denied' }
          ]
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'failed-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'failed-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors.length, 1);
      assert.strictEqual(result.errors[0].type, 'folder');
      assert.strictEqual(result.errors[0].name, 'failed-folder');
      assert.strictEqual(result.errors[0].error, 'Permission denied');
    });

    it('should handle API exceptions gracefully', async () => {
      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersError: new Error('Network error')
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors.length, 1);
      assert.strictEqual(result.errors[0].type, 'folder_batch');
      assert.strictEqual(result.errors[0].error, 'Network error');
    });

  it('should send correct payload with all test suite fields', async () => {
      let testSuitePayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'test-folder', id: 'folder-id-123' }
          ]
        },
        syncManualTestSuitesResponse: (payload) => {
          testSuitePayload = payload;
          return {
            results: [
              { success: true, name: 'Login Tests' }
            ]
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                name: 'Login Tests',
                hash: 'suite-hash',
                type: 'feature',
                tags: ['@smoke', '@critical'],
                before_each: [],
                test_cases: []
              }
            ],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                type: 'create',
                name: 'Login Tests',
                hash: 'suite-hash'
              }
            ],
            folders: []
          }
        ]
      };

      await synchronizer.sync(structure, compareResult, 'project-456');

      assert.strictEqual(testSuitePayload.project_id, 'project-456');
      assert.strictEqual(testSuitePayload.suites.length, 1);
      assert.strictEqual(testSuitePayload.suites[0].name, 'Login Tests');
      assert.strictEqual(testSuitePayload.suites[0].hash, 'suite-hash');
      assert.strictEqual(testSuitePayload.suites[0].type, 'create');
      assert.deepStrictEqual(testSuitePayload.suites[0].tags, ['@smoke', '@critical']);
      assert.strictEqual(testSuitePayload.suites[0].folder_id, 'folder-id-123');
    });

    it('should map before_each steps correctly', async () => {
      let testSuitePayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'test-folder', id: 'folder-id-123' }
          ]
        },
        syncManualTestSuitesResponse: (payload) => {
          testSuitePayload = payload;
          return {
            results: [
              { success: true, name: 'Test Suite' }
            ]
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                name: 'Test Suite',
                hash: 'suite-hash',
                type: 'feature',
                tags: [],
                before_each: [
                  { name: 'Given I am logged in', type: 'background' },
                  { name: 'And I have permissions', type: 'background' }
                ],
                test_cases: []
              }
            ],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                type: 'create',
                name: 'Test Suite',
                hash: 'suite-hash'
              }
            ],
            folders: []
          }
        ]
      };

      await synchronizer.sync(structure, compareResult, 'project-123');

      assert.deepStrictEqual(testSuitePayload.suites[0].before_each, [
        'Given I am logged in',
        'And I have permissions'
      ]);
    });

    it('should map test_cases with steps correctly', async () => {
      let testSuitePayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'test-folder', id: 'folder-id-123' }
          ]
        },
        syncManualTestSuitesResponse: (payload) => {
          testSuitePayload = payload;
          return {
            results: [
              { success: true, name: 'Test Suite' }
            ]
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                name: 'Test Suite',
                hash: 'suite-hash',
                type: 'feature',
                tags: [],
                before_each: [],
                test_cases: [
                  {
                    name: 'Login Test',
                    type: 'scenario',
                    tags: ['@smoke'],
                    hash: 'test-case-hash',
                    steps: [
                      { name: 'Given I am on login page' },
                      { name: 'When I enter credentials' },
                      { name: 'Then I should be logged in' }
                    ]
                  }
                ]
              }
            ],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                type: 'create',
                name: 'Test Suite',
                hash: 'suite-hash'
              }
            ],
            folders: []
          }
        ]
      };

      await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(testSuitePayload.suites[0].test_cases.length, 1);
      assert.strictEqual(testSuitePayload.suites[0].test_cases[0].name, 'Login Test');
      assert.strictEqual(testSuitePayload.suites[0].test_cases[0].type, 'scenario');
      assert.deepStrictEqual(testSuitePayload.suites[0].test_cases[0].tags, ['@smoke']);
      assert.strictEqual(testSuitePayload.suites[0].test_cases[0].hash, 'test-case-hash');
      assert.deepStrictEqual(testSuitePayload.suites[0].test_cases[0].steps, [
        'Given I am on login page',
        'When I enter credentials',
        'Then I should be logged in'
      ]);
    });

    it('should handle test suite sync failures', async () => {
      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'test-folder', id: 'folder-id-123' }
          ]
        },
        syncManualTestSuitesResponse: {
          results: [
            { success: false, name: 'Failed Suite', error: 'Validation error' }
          ]
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                name: 'Failed Suite',
                hash: 'suite-hash',
                type: 'feature',
                tags: [],
                before_each: [],
                test_cases: []
              }
            ],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                type: 'create',
                name: 'Failed Suite',
                hash: 'suite-hash'
              }
            ],
            folders: []
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors.length, 1);
      assert.strictEqual(result.errors[0].type, 'test_suite');
      assert.strictEqual(result.errors[0].name, 'Failed Suite');
      assert.strictEqual(result.errors[0].error, 'Validation error');
    });

    it('should handle test suite API exceptions gracefully', async () => {
      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'test-folder', id: 'folder-id-123' }
          ]
        },
        syncManualTestSuitesError: new Error('Connection timeout')
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                name: 'Test Suite',
                hash: 'suite-hash',
                type: 'feature',
                tags: [],
                before_each: [],
                test_cases: []
              }
            ],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                type: 'create',
                name: 'Test Suite',
                hash: 'suite-hash'
              }
            ],
            folders: []
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors.length, 1);
      assert.strictEqual(result.errors[0].type, 'test_suite_batch');
      assert.strictEqual(result.errors[0].error, 'Connection timeout');
    });

  it('should handle complex nested structure with mixed operations', async () => {
      let folderCalls = [];
      let testSuiteCalls = [];

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: (payload) => {
          folderCalls.push(payload);
          return {
            results: payload.folders.map(folder => ({
              success: true,
              name: folder.name,
              id: `${folder.name}-id`
            }))
          };
        },
        syncManualTestSuitesResponse: (payload) => {
          testSuiteCalls.push(payload);
          return {
            results: payload.suites.map(suite => ({
              success: true,
              name: suite.name
            }))
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'smoke',
            hash: 'smoke-hash',
            test_suites: [
              {
                name: 'Login Tests',
                hash: 'login-hash',
                type: 'feature',
                tags: ['@smoke'],
                before_each: [],
                test_cases: []
              }
            ],
            folders: []
          },
          {
            name: 'regression',
            hash: 'regression-hash',
            test_suites: [],
            folders: [
              {
                name: 'api',
                hash: 'api-hash',
                test_suites: [
                  {
                    name: 'API Tests',
                    hash: 'api-test-hash',
                    type: 'feature',
                    tags: [],
                    before_each: [],
                    test_cases: []
                  }
                ],
                folders: []
              }
            ]
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'smoke',
            hash: 'smoke-hash',
            test_suites: [
              {
                type: 'create',
                name: 'Login Tests',
                hash: 'login-hash'
              }
            ],
            folders: []
          },
          {
            type: 'update',
            name: 'regression',
            hash: 'regression-hash',
            id: 'regression-existing-id',
            test_suites: [],
            folders: [
              {
                type: 'create',
                name: 'api',
                hash: 'api-hash',
                test_suites: [
                  {
                    type: 'create',
                    name: 'API Tests',
                    hash: 'api-test-hash'
                  }
                ],
                folders: []
              }
            ]
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-complex');

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.foldersProcessed, 3); // smoke, regression, api
      assert.strictEqual(result.testSuitesProcessed, 2);
      assert.strictEqual(folderCalls.length, 2); // root level + api subfolder
      assert.strictEqual(testSuiteCalls.length, 2); // Login Tests + API Tests
    });

    it('should propagate folder_id to test suites correctly', async () => {
      let testSuitePayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'folder1', id: 'folder1-id' },
            { success: true, name: 'folder2', id: 'folder2-id' }
          ]
        },
        syncManualTestSuitesResponse: (payload) => {
          if (!testSuitePayload) {
            testSuitePayload = [];
          }
          testSuitePayload.push(payload);
          return {
            results: payload.suites.map(suite => ({
              success: true,
              name: suite.name
            }))
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'folder1',
            hash: 'folder1-hash',
            test_suites: [
              {
                name: 'Suite A',
                hash: 'suite-a-hash',
                type: 'feature',
                tags: [],
                before_each: [],
                test_cases: []
              }
            ],
            folders: []
          },
          {
            name: 'folder2',
            hash: 'folder2-hash',
            test_suites: [
              {
                name: 'Suite B',
                hash: 'suite-b-hash',
                type: 'feature',
                tags: [],
                before_each: [],
                test_cases: []
              }
            ],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'folder1',
            hash: 'folder1-hash',
            test_suites: [
              { type: 'create', name: 'Suite A', hash: 'suite-a-hash' }
            ],
            folders: []
          },
          {
            type: 'create',
            name: 'folder2',
            hash: 'folder2-hash',
            test_suites: [
              { type: 'create', name: 'Suite B', hash: 'suite-b-hash' }
            ],
            folders: []
          }
        ]
      };

      await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(testSuitePayload[0].suites[0].folder_id, 'folder1-id');
      assert.strictEqual(testSuitePayload[1].suites[0].folder_id, 'folder2-id');
    });

    it('should handle partial failures', async () => {
      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'success-folder', id: 'success-id' },
            { success: false, name: 'fail-folder', error: 'Permission denied' }
          ]
        },
        syncManualTestSuitesResponse: {
          results: [
            { success: true, name: 'Suite A' },
            { success: false, name: 'Suite B', error: 'Invalid data' }
          ]
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'success-folder',
            hash: 'success-hash',
            test_suites: [
              {
                name: 'Suite A',
                hash: 'suite-a-hash',
                type: 'feature',
                tags: [],
                before_each: [],
                test_cases: []
              },
              {
                name: 'Suite B',
                hash: 'suite-b-hash',
                type: 'feature',
                tags: [],
                before_each: [],
                test_cases: []
              }
            ],
            folders: []
          },
          {
            name: 'fail-folder',
            hash: 'fail-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'success-folder',
            hash: 'success-hash',
            test_suites: [
              { type: 'create', name: 'Suite A', hash: 'suite-a-hash' },
              { type: 'create', name: 'Suite B', hash: 'suite-b-hash' }
            ],
            folders: []
          },
          {
            type: 'create',
            name: 'fail-folder',
            hash: 'fail-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const result = await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.foldersProcessed, 1);
      assert.strictEqual(result.testSuitesProcessed, 1);
      assert.strictEqual(result.errors.length, 2);

      // Check errors exist (order may vary based on sync sequence)
      const folderError = result.errors.find(e => e.type === 'folder');
      const testSuiteError = result.errors.find(e => e.type === 'test_suite');

      assert.ok(folderError);
      assert.strictEqual(folderError.name, 'fail-folder');
      assert.strictEqual(folderError.error, 'Permission denied');

      assert.ok(testSuiteError);
      assert.strictEqual(testSuiteError.name, 'Suite B');
      assert.strictEqual(testSuiteError.error, 'Invalid data');
    });

    it('should handle server-only folders in compare result', async () => {
      let capturedPayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: (payload) => {
          capturedPayload = payload;
          return {
            results: payload.folders.map(folder => ({
              success: true,
              name: folder.name,
              id: folder.id || `${folder.name}-new-id`
            }))
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'local-folder',
            hash: 'local-hash',
            test_suites: [],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'create',
            name: 'local-folder',
            hash: 'local-hash',
            test_suites: [],
            folders: []
          },
          {
            type: 'delete',
            name: 'server-only-folder',
            hash: 'server-hash',
            id: 'server-folder-id',
            test_suites: [],
            folders: []
          }
        ]
      };

      await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(capturedPayload.folders.length, 2);
      assert.strictEqual(capturedPayload.folders[0].name, 'local-folder');
      assert.strictEqual(capturedPayload.folders[1].name, 'server-only-folder');
      assert.strictEqual(capturedPayload.folders[1].type, 'delete');
      assert.strictEqual(capturedPayload.folders[1].id, 'server-folder-id');
    });

    it('should merge test suites from both local and server', async () => {
      let testSuitePayload = null;

      const mockBeatsApi = createMockBeatsApi({
        syncManualFoldersResponse: {
          results: [
            { success: true, name: 'test-folder', id: 'folder-id-123' }
          ]
        },
        syncManualTestSuitesResponse: (payload) => {
          testSuitePayload = payload;
          return {
            results: payload.suites.map(suite => ({
              success: true,
              name: suite.name
            }))
          };
        }
      });

      const synchronizer = new ManualTestSynchronizer(mockBeatsApi);

      const structure = {
        name: 'root',
        path: '/root',
        hash: 'root-hash',
        test_suites: [],
        folders: [
          {
            name: 'test-folder',
            hash: 'folder-hash',
            test_suites: [
              {
                name: 'Local Suite',
                hash: 'local-suite-hash',
                type: 'feature',
                tags: [],
                before_each: [],
                test_cases: []
              }
            ],
            folders: []
          }
        ]
      };

      const compareResult = {
        folders: [
          {
            type: 'update',
            name: 'test-folder',
            hash: 'folder-hash',
            id: 'folder-id-123',
            test_suites: [
              {
                type: 'update',
                name: 'Local Suite',
                hash: 'local-suite-hash',
                id: 'local-suite-id'
              },
              {
                type: 'delete',
                name: 'Server Suite',
                hash: 'server-suite-hash',
                id: 'server-suite-id'
              }
            ],
            folders: []
          }
        ]
      };

      await synchronizer.sync(structure, compareResult, 'project-123');

      assert.strictEqual(testSuitePayload.suites.length, 2);
      assert.strictEqual(testSuitePayload.suites[0].name, 'Local Suite');
      assert.strictEqual(testSuitePayload.suites[0].type, 'update');
      assert.strictEqual(testSuitePayload.suites[1].name, 'Server Suite');
      assert.strictEqual(testSuitePayload.suites[1].type, 'delete');
    });
});

