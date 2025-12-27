const { ProjectResolver } = require('../src/manual/project-resolver');
const assert = require('assert');

function createMockBeatsApi(searchResponse) {
  return {
    searchProjects: async (projectName) => {
      if (typeof searchResponse === 'function') {
        return searchResponse(projectName);
      }
      return searchResponse;
    }
  };
}

describe('ProjectResolver', () => {
  it('should resolve project name to project ID', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-123', name: 'My Project' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('My Project');

    assert.strictEqual(projectId, 'proj-123');
  });

  it('should resolve correct project when multiple projects returned', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-111', name: 'Test Project' },
        { id: 'proj-222', name: 'Test Project 2' },
        { id: 'proj-333', name: 'Another Test' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('Test Project 2');

    assert.strictEqual(projectId, 'proj-222');
  });

  it('should find exact match when similar names exist', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-001', name: 'API Tests' },
        { id: 'proj-002', name: 'API Tests Production' },
        { id: 'proj-003', name: 'API Tests Staging' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('API Tests');

    assert.strictEqual(projectId, 'proj-001');
  });

  it('should throw error when project not found in results', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-111', name: 'Project A' },
        { id: 'proj-222', name: 'Project B' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    await assert.rejects(
      async () => await resolver.resolveProject('Project C'),
      /Project Project C not found/
    );
  });

  it('should throw error when API returns null response', async () => {
    const mockBeatsApi = createMockBeatsApi(null);
    const resolver = new ProjectResolver(mockBeatsApi);

    await assert.rejects(
      async () => await resolver.resolveProject('My Project'),
      /Project My Project not found/
    );
  });

  it('should throw error when API returns undefined response', async () => {
    const mockBeatsApi = createMockBeatsApi(undefined);
    const resolver = new ProjectResolver(mockBeatsApi);

    await assert.rejects(
      async () => await resolver.resolveProject('My Project'),
      /Project My Project not found/
    );
  });

  it('should throw error when values array is missing', async () => {
    const mockBeatsApi = createMockBeatsApi({});
    const resolver = new ProjectResolver(mockBeatsApi);

    await assert.rejects(
      async () => await resolver.resolveProject('My Project'),
      /Project My Project not found/
    );
  });

  it('should throw error when values array is empty', async () => {
    const mockBeatsApi = createMockBeatsApi({ values: [] });
    const resolver = new ProjectResolver(mockBeatsApi);

    await assert.rejects(
      async () => await resolver.resolveProject('My Project'),
      /Project My Project not found/
    );
  });

  it('should handle project names with special characters', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-special', name: 'Project-Name_With.Special$Chars' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('Project-Name_With.Special$Chars');

    assert.strictEqual(projectId, 'proj-special');
  });

  it('should handle project names with spaces and punctuation', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-punctuation', name: 'My Project: Test Environment (v2.0)' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('My Project: Test Environment (v2.0)');

    assert.strictEqual(projectId, 'proj-punctuation');
  });

  it('should handle project names with unicode characters', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-unicode', name: 'Проект Тест 测试项目' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('Проект Тест 测试项目');

    assert.strictEqual(projectId, 'proj-unicode');
  });

  it('should be case-sensitive when matching project names', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-lower', name: 'my project' },
        { id: 'proj-upper', name: 'MY PROJECT' },
        { id: 'proj-mixed', name: 'My Project' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('My Project');

    assert.strictEqual(projectId, 'proj-mixed');
  });

  it('should pass project name to API search method', async () => {
    let capturedSearchTerm = null;
    const mockBeatsApi = createMockBeatsApi((projectName) => {
      capturedSearchTerm = projectName;
      return {
        values: [
          { id: 'proj-123', name: projectName }
        ]
      };
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    await resolver.resolveProject('Test Search Project');

    assert.strictEqual(capturedSearchTerm, 'Test Search Project');
  });

  it('should handle very long project names', async () => {
    const longName = 'This is a very long project name that might be used in enterprise environments with extensive naming conventions and detailed descriptions included in the project identifier';
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-long', name: longName }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject(longName);

    assert.strictEqual(projectId, 'proj-long');
  });

  it('should handle project IDs with different formats', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'abc-123-def-456', name: 'Project with UUID-like ID' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('Project with UUID-like ID');

    assert.strictEqual(projectId, 'abc-123-def-456');
  });

  it('should handle numeric project IDs', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: '12345', name: 'Numeric ID Project' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('Numeric ID Project');

    assert.strictEqual(projectId, '12345');
  });

  it('should handle API errors gracefully', async () => {
    const mockBeatsApi = {
      searchProjects: async () => {
        throw new Error('Network error');
      }
    };
    const resolver = new ProjectResolver(mockBeatsApi);

    await assert.rejects(
      async () => await resolver.resolveProject('My Project'),
      /Network error/
    );
  });

  it('should handle malformed response with null values array', async () => {
    const mockBeatsApi = createMockBeatsApi({ values: null });
    const resolver = new ProjectResolver(mockBeatsApi);

    await assert.rejects(
      async () => await resolver.resolveProject('My Project'),
      /Project My Project not found/
    );
  });

  it('should return first matching project if duplicates exist', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-first', name: 'Duplicate Name' },
        { id: 'proj-second', name: 'Duplicate Name' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('Duplicate Name');

    assert.strictEqual(projectId, 'proj-first');
  });

  it('should handle empty string project name', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        { id: 'proj-empty', name: '' }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('');

    assert.strictEqual(projectId, 'proj-empty');
  });

  it('should handle project objects with additional properties', async () => {
    const mockBeatsApi = createMockBeatsApi({
      values: [
        {
          id: 'proj-123',
          name: 'My Project',
          description: 'Test project',
          created: '2024-01-01',
          owner: 'user@example.com',
          tags: ['test', 'qa']
        }
      ]
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const projectId = await resolver.resolveProject('My Project');

    assert.strictEqual(projectId, 'proj-123');
  });

  it('should resolve different projects independently', async () => {
    const mockBeatsApi = createMockBeatsApi((projectName) => {
      const projects = {
        'Project Alpha': { id: 'proj-alpha', name: 'Project Alpha' },
        'Project Beta': { id: 'proj-beta', name: 'Project Beta' },
        'Project Gamma': { id: 'proj-gamma', name: 'Project Gamma' }
      };
      return {
        values: projects[projectName] ? [projects[projectName]] : []
      };
    });
    const resolver = new ProjectResolver(mockBeatsApi);

    const id1 = await resolver.resolveProject('Project Alpha');
    const id2 = await resolver.resolveProject('Project Beta');
    const id3 = await resolver.resolveProject('Project Gamma');

    assert.strictEqual(id1, 'proj-alpha');
    assert.strictEqual(id2, 'proj-beta');
    assert.strictEqual(id3, 'proj-gamma');
  });
});

