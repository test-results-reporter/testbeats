const { ManualTestComparator } = require('../src/manual/comparator');
const assert = require('assert');

function createMockBeatsApi(compareResponse) {
  return {
    compareManualTests: async (payload) => {
      if (typeof compareResponse === 'function') {
        return compareResponse(payload);
      }
      return compareResponse;
    }
  };
}

describe('ManualTestComparator', () => {
  it('should compare structure with server and return response', async () => {
    const mockResponse = {
      folders: [
        {
          type: 'no_change',
          name: 'folder1',
          hash: 'folder1-hash',
          id: 'f789d486-2b5f-44f2-b639-5b2bd3e0f918',
          test_suites: [],
          folders: []
        }
      ]
    };

    const mockBeatsApi = createMockBeatsApi(mockResponse);
    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'folder1',
          hash: 'folder1-hash',
          test_suites: [],
          folders: []
        }
      ]
    };

    const result = await comparator.compare(structure, 'project-123');

    assert.deepStrictEqual(result, mockResponse);
  });

  it('should send correct payload to API', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'tests',
          hash: 'tests-hash',
          test_suites: [
            {
              name: 'Login Tests',
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

    await comparator.compare(structure, 'project-456');

    assert.strictEqual(capturedPayload.project_id, 'project-456');
    assert.strictEqual(capturedPayload.folders.length, 1);
    assert.strictEqual(capturedPayload.folders[0].name, 'tests');
    assert.strictEqual(capturedPayload.folders[0].hash, 'tests-hash');
    assert.strictEqual(capturedPayload.folders[0].test_suites.length, 1);
    assert.strictEqual(capturedPayload.folders[0].test_suites[0].name, 'Login Tests');
    assert.strictEqual(capturedPayload.folders[0].test_suites[0].hash, 'suite-hash');
  });

  it('should handle nested folder structure', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'level1',
          hash: 'level1-hash',
          test_suites: [],
          folders: [
            {
              name: 'level2',
              hash: 'level2-hash',
              test_suites: [
                {
                  name: 'Nested Test',
                  hash: 'nested-hash',
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

    await comparator.compare(structure, 'project-789');

    assert.strictEqual(capturedPayload.folders[0].folders.length, 1);
    assert.strictEqual(capturedPayload.folders[0].folders[0].name, 'level2');
    assert.strictEqual(capturedPayload.folders[0].folders[0].test_suites.length, 1);
  });

  it('should handle multiple folders at same level', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'folder1',
          hash: 'hash1',
          test_suites: [],
          folders: []
        },
        {
          name: 'folder2',
          hash: 'hash2',
          test_suites: [],
          folders: []
        },
        {
          name: 'folder3',
          hash: 'hash3',
          test_suites: [],
          folders: []
        }
      ]
    };

    await comparator.compare(structure, 'project-123');

    assert.strictEqual(capturedPayload.folders.length, 3);
    assert.strictEqual(capturedPayload.folders[0].name, 'folder1');
    assert.strictEqual(capturedPayload.folders[1].name, 'folder2');
    assert.strictEqual(capturedPayload.folders[2].name, 'folder3');
  });

  it('should handle multiple test suites in a folder', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'tests',
          hash: 'tests-hash',
          test_suites: [
            { name: 'Suite1', hash: 'hash1', type: 'feature', tags: [], before_each: [], test_cases: [] },
            { name: 'Suite2', hash: 'hash2', type: 'feature', tags: [], before_each: [], test_cases: [] },
            { name: 'Suite3', hash: 'hash3', type: 'feature', tags: [], before_each: [], test_cases: [] }
          ],
          folders: []
        }
      ]
    };

    await comparator.compare(structure, 'project-123');

    assert.strictEqual(capturedPayload.folders[0].test_suites.length, 3);
    assert.strictEqual(capturedPayload.folders[0].test_suites[0].name, 'Suite1');
    assert.strictEqual(capturedPayload.folders[0].test_suites[1].name, 'Suite2');
    assert.strictEqual(capturedPayload.folders[0].test_suites[2].name, 'Suite3');
  });

  it('should handle empty folder structure', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: []
    };

    await comparator.compare(structure, 'project-123');

    assert.strictEqual(capturedPayload.project_id, 'project-123');
    assert.strictEqual(capturedPayload.folders.length, 0);
  });

  it('should throw error when API call fails', async () => {
    const mockBeatsApi = {
      compareManualTests: async () => {
        throw new Error('Network error');
      }
    };

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: []
    };

    await assert.rejects(
      async () => await comparator.compare(structure, 'project-123'),
      /Network error/
    );
  });

  it('should throw error with original error message', async () => {
    const mockBeatsApi = {
      compareManualTests: async () => {
        throw new Error('Unauthorized access');
      }
    };

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: []
    };

    await assert.rejects(
      async () => await comparator.compare(structure, 'project-123'),
      /Unauthorized access/
    );
  });

  it('should only include name and hash in test suite payload', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'tests',
          hash: 'tests-hash',
          test_suites: [
            {
              name: 'Full Test Suite',
              hash: 'suite-hash',
              type: 'feature',
              tags: ['@smoke', '@regression'],
              before_each: [{ type: 'background', steps: [] }],
              test_cases: [
                { name: 'Test Case 1', type: 'scenario', tags: [], steps: [] }
              ],
              path: '/path/to/test.feature',
              extra_field: 'should not be included'
            }
          ],
          folders: []
        }
      ]
    };

    await comparator.compare(structure, 'project-123');

    const testSuite = capturedPayload.folders[0].test_suites[0];
    assert.strictEqual(testSuite.name, 'Full Test Suite');
    assert.strictEqual(testSuite.hash, 'suite-hash');
    assert.strictEqual(Object.keys(testSuite).length, 2);
    assert.strictEqual(testSuite.type, undefined);
    assert.strictEqual(testSuite.tags, undefined);
    assert.strictEqual(testSuite.before_each, undefined);
    assert.strictEqual(testSuite.test_cases, undefined);
  });

  it('should only include name, hash, test_suites, and folders in folder payload', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'tests',
          hash: 'tests-hash',
          path: '/path/to/tests',
          extra_field: 'should not be included',
          test_suites: [],
          folders: []
        }
      ]
    };

    await comparator.compare(structure, 'project-123');

    const folder = capturedPayload.folders[0];
    assert.strictEqual(folder.name, 'tests');
    assert.strictEqual(folder.hash, 'tests-hash');
    assert.ok(Array.isArray(folder.test_suites));
    assert.ok(Array.isArray(folder.folders));
    assert.strictEqual(Object.keys(folder).length, 4);
    assert.strictEqual(folder.path, undefined);
    assert.strictEqual(folder.extra_field, undefined);
  });

  it('should recursively build nested folder payload', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'level1',
          hash: 'hash1',
          test_suites: [],
          folders: [
            {
              name: 'level2',
              hash: 'hash2',
              test_suites: [],
              folders: [
                {
                  name: 'level3',
                  hash: 'hash3',
                  test_suites: [],
                  folders: []
                }
              ]
            }
          ]
        }
      ]
    };

    await comparator.compare(structure, 'project-123');

    assert.strictEqual(capturedPayload.folders[0].name, 'level1');
    assert.strictEqual(capturedPayload.folders[0].folders[0].name, 'level2');
    assert.strictEqual(capturedPayload.folders[0].folders[0].folders[0].name, 'level3');
  });

  it('should include project_id in payload', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: []
    };

    await comparator.compare(structure, 'my-project-id-123');

    assert.strictEqual(capturedPayload.project_id, 'my-project-id-123');
  });

  it('should handle complex real-world structure', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return {
        folders: [
          {
            type: 'create',
            name: 'new-folder',
            hash: 'new-hash',
            folders: [],
            test_suites: []
          },
          {
            type: 'update',
            name: 'smoke',
            hash: 'smoke-hash',
            id: 'smoke-id-123',
            test_suites: [
              {
                type: 'no_change',
                name: 'Login Tests',
                hash: 'login-hash',
                folder_id: 'smoke-id-123',
                id: 'login-id-456'
              },
              {
                type: 'create',
                name: 'Logout Tests',
                hash: 'logout-hash',
                folder_id: 'smoke-id-123'
              }
            ],
            folders: []
          },
          {
            type: 'delete',
            name: 'old-folder',
            hash: 'old-hash',
            id: 'old-folder-id',
            folders: [],
            test_suites: []
          }
        ]
      };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/project/tests',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'smoke',
          hash: 'smoke-hash',
          test_suites: [
            { name: 'Login Tests', hash: 'login-hash', type: 'feature', tags: [], before_each: [], test_cases: [] },
            { name: 'Logout Tests', hash: 'logout-hash', type: 'feature', tags: [], before_each: [], test_cases: [] }
          ],
          folders: []
        },
        {
          name: 'regression',
          hash: 'regression-hash',
          test_suites: [
            { name: 'Payment Tests', hash: 'payment-hash', type: 'feature', tags: [], before_each: [], test_cases: [] }
          ],
          folders: [
            {
              name: 'api',
              hash: 'api-hash',
              test_suites: [
                { name: 'API Tests', hash: 'api-test-hash', type: 'feature', tags: [], before_each: [], test_cases: [] }
              ],
              folders: []
            }
          ]
        }
      ]
    };

    const result = await comparator.compare(structure, 'project-real-world');

    assert.strictEqual(capturedPayload.project_id, 'project-real-world');
    assert.strictEqual(capturedPayload.folders.length, 2);
    assert.strictEqual(capturedPayload.folders[0].test_suites.length, 2);
    assert.strictEqual(capturedPayload.folders[1].folders.length, 1);
    assert.strictEqual(result.folders.length, 3);
    assert.strictEqual(result.folders[0].type, 'create');
    assert.strictEqual(result.folders[1].type, 'update');
  });

  it('should handle folder with no test suites', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'empty-folder',
          hash: 'empty-hash',
          test_suites: [],
          folders: []
        }
      ]
    };

    await comparator.compare(structure, 'project-123');

    assert.strictEqual(capturedPayload.folders[0].test_suites.length, 0);
    assert.strictEqual(capturedPayload.folders[0].folders.length, 0);
  });

  it('should preserve folder and test suite order', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'z-folder',
          hash: 'z-hash',
          test_suites: [
            { name: 'Z Test', hash: 'z-test', type: 'feature', tags: [], before_each: [], test_cases: [] },
            { name: 'A Test', hash: 'a-test', type: 'feature', tags: [], before_each: [], test_cases: [] }
          ],
          folders: []
        },
        {
          name: 'a-folder',
          hash: 'a-hash',
          test_suites: [],
          folders: []
        }
      ]
    };

    await comparator.compare(structure, 'project-123');

    assert.strictEqual(capturedPayload.folders[0].name, 'z-folder');
    assert.strictEqual(capturedPayload.folders[1].name, 'a-folder');
    assert.strictEqual(capturedPayload.folders[0].test_suites[0].name, 'Z Test');
    assert.strictEqual(capturedPayload.folders[0].test_suites[1].name, 'A Test');
  });

  it('should handle special characters in names', async () => {
    let capturedPayload = null;

    const mockBeatsApi = createMockBeatsApi((payload) => {
      capturedPayload = payload;
      return { folders: [] };
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/root',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'folder-with-dashes_and_underscores',
          hash: 'special-hash',
          test_suites: [
            {
              name: 'Test: With Colons & Symbols (v2.0)',
              hash: 'test-hash',
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

    await comparator.compare(structure, 'project-123');

    assert.strictEqual(capturedPayload.folders[0].name, 'folder-with-dashes_and_underscores');
    assert.strictEqual(capturedPayload.folders[0].test_suites[0].name, 'Test: With Colons & Symbols (v2.0)');
  });

  it('should handle realistic API response with type and id fields', async () => {
    const mockBeatsApi = createMockBeatsApi({
      folders: [
        {
          type: 'no_change',
          name: 'empty-folder',
          hash: '1e9b0f6accf2965dbbd771ad333ce438',
          id: 'f789d486-2b5f-44f2-b639-5b2bd3e0f918',
          folders: [
            {
              type: 'no_change',
              name: 'another-empty',
              hash: 'd713e214708f1ed91f2767f8a7284d11',
              parent_folder_id: 'f789d486-2b5f-44f2-b639-5b2bd3e0f918',
              id: 'abf0882a-e9e3-4e95-8079-0a5369c38f78',
              test_suites: [],
              folders: []
            }
          ],
          test_suites: []
        },
        {
          type: 'create',
          name: 'new-folder',
          hash: 'aa6dfe272a3e658af2e6774cb9fcf46b',
          test_suites: [
            {
              type: 'create',
              name: 'New Test Suite',
              hash: '61d6802bd1ef751a15d1d3d59a8e53b0'
            }
          ],
          folders: []
        },
        {
          type: 'update',
          name: 'existing-folder',
          hash: '7fdb0a696f5763f26d423423930d35f7',
          id: 'e921d357-775a-4542-9482-7f680a13a6d7',
          test_suites: [
            {
              type: 'no_change',
              name: 'Unchanged Suite',
              folder_id: 'e921d357-775a-4542-9482-7f680a13a6d7',
              hash: 'aff9d309f122cbc8850ba4d55a4e1302',
              id: 'e2fc9738-6ee2-4843-8bd1-f608ce224a3a'
            },
            {
              type: 'update',
              name: 'Updated Suite',
              folder_id: 'e921d357-775a-4542-9482-7f680a13a6d7',
              hash: '3760ea635ad9c78163c62479137bedd0',
              id: '4d247fe7-848b-4bae-baa6-b42acde856f5'
            },
            {
              type: 'delete',
              name: 'Deleted Suite',
              folder_id: 'e921d357-775a-4542-9482-7f680a13a6d7',
              hash: '1a78fc322503cd05fff0e454792c2bc7',
              id: '14fb1cb1-f171-4178-823f-0ffa447ba09f'
            }
          ],
          folders: []
        }
      ]
    });

    const comparator = new ManualTestComparator(mockBeatsApi);

    const structure = {
      name: 'root',
      path: '/project/tests',
      hash: 'root-hash',
      test_suites: [],
      folders: [
        {
          name: 'empty-folder',
          hash: '1e9b0f6accf2965dbbd771ad333ce438',
          test_suites: [],
          folders: [
            {
              name: 'another-empty',
              hash: 'd713e214708f1ed91f2767f8a7284d11',
              test_suites: [],
              folders: []
            }
          ]
        },
        {
          name: 'new-folder',
          hash: 'aa6dfe272a3e658af2e6774cb9fcf46b',
          test_suites: [
            {
              name: 'New Test Suite',
              hash: '61d6802bd1ef751a15d1d3d59a8e53b0',
              type: 'feature',
              tags: [],
              before_each: [],
              test_cases: []
            }
          ],
          folders: []
        },
        {
          name: 'existing-folder',
          hash: '7fdb0a696f5763f26d423423930d35f7',
          test_suites: [
            {
              name: 'Unchanged Suite',
              hash: 'aff9d309f122cbc8850ba4d55a4e1302',
              type: 'feature',
              tags: [],
              before_each: [],
              test_cases: []
            },
            {
              name: 'Updated Suite',
              hash: '3760ea635ad9c78163c62479137bedd0',
              type: 'feature',
              tags: [],
              before_each: [],
              test_cases: []
            },
            {
              name: 'Deleted Suite',
              hash: '1a78fc322503cd05fff0e454792c2bc7',
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

    const result = await comparator.compare(structure, 'project-456');

    // Verify response structure matches API format
    assert.ok(result.folders);
    assert.strictEqual(result.folders.length, 3);

    // Check folder types
    assert.strictEqual(result.folders[0].type, 'no_change');
    assert.strictEqual(result.folders[1].type, 'create');
    assert.strictEqual(result.folders[2].type, 'update');

    // Check folder with nested structure
    assert.strictEqual(result.folders[0].folders.length, 1);
    assert.strictEqual(result.folders[0].folders[0].type, 'no_change');
    assert.ok(result.folders[0].folders[0].parent_folder_id);

    // Check test suite types
    assert.strictEqual(result.folders[2].test_suites.length, 3);
    assert.strictEqual(result.folders[2].test_suites[0].type, 'no_change');
    assert.strictEqual(result.folders[2].test_suites[1].type, 'update');
    assert.strictEqual(result.folders[2].test_suites[2].type, 'delete');

    // Check IDs are included for existing items
    assert.ok(result.folders[0].id);
    assert.ok(result.folders[2].id);
    assert.ok(result.folders[2].test_suites[0].id);
    assert.ok(result.folders[2].test_suites[0].folder_id);
  });
});
