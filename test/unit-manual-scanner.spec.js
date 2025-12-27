const { ManualTestScanner } = require('../src/manual/scanner');
const assert = require('assert');
const path = require('path');

function createMockFs(fileStructure) {
  const normalizePath = (p) => {
    // Remove drive letter on Windows (e.g., 'C:\' -> '\')
    let normalized = p.replace(/^[A-Za-z]:/, '');
    // Convert all backslashes to forward slashes
    normalized = normalized.split(path.sep).join('/');
    return normalized;
  };

  return {
    existsSync: (filePath) => {
      return fileStructure[normalizePath(filePath)] !== undefined;
    },
    statSync: (filePath) => {
      const item = fileStructure[normalizePath(filePath)];
      if (!item) {
        throw new Error(`ENOENT: no such file or directory, stat '${filePath}'`);
      }
      return {
        isDirectory: () => item.type === 'directory',
        isFile: () => item.type === 'file'
      };
    },
    readdirSync: (dirPath) => {
      const item = fileStructure[normalizePath(dirPath)];
      if (!item || item.type !== 'directory') {
        throw new Error(`ENOTDIR: not a directory, scandir '${dirPath}'`);
      }
      return item.children || [];
    }
  };
}

function createMockParser(parseResults) {
  return {
    parse: (filePath) => {
      if (typeof parseResults === 'function') {
        return parseResults(filePath);
      }
      return parseResults[filePath] || parseResults;
    }
  };
}

describe('ManualTestScanner', () => {
  it('should scan directory with single feature file', async () => {
    const mockFs = createMockFs({
      '/test/features': {
        type: 'directory',
        children: ['login.feature']
      },
      '/test/features/login.feature': {
        type: 'file'
      }
    });

    const mockParser = createMockParser({
      '/test/features/login.feature': {
        name: 'Login Feature',
        type: 'feature',
        tags: ['@smoke'],
        before_each: [],
        test_cases: [
          { name: 'Successful login', type: 'scenario', tags: [], steps: [] }
        ]
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = await scanner.scanDirectory('/test/features');

    assert.strictEqual(result.name, 'features');
    assert.strictEqual(result.path, '/test/features');
    assert.strictEqual(result.test_suites.length, 0);
    assert.strictEqual(result.folders.length, 1);
    assert.strictEqual(result.folders[0].name, 'default');
    assert.strictEqual(result.folders[0].test_suites.length, 1);
    assert.strictEqual(result.folders[0].test_suites[0].name, 'Login Feature');
  });

  it('should scan directory with multiple feature files', async () => {
    const mockFs = createMockFs({
      '/test/features': {
        type: 'directory',
        children: ['login.feature', 'logout.feature', 'register.feature']
      },
      '/test/features/login.feature': { type: 'file' },
      '/test/features/logout.feature': { type: 'file' },
      '/test/features/register.feature': { type: 'file' }
    });

    const mockParser = createMockParser((filePath) => ({
      name: path.basename(filePath, '.feature'),
      type: 'feature',
      tags: [],
      before_each: [],
      test_cases: []
    }));

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = await scanner.scanDirectory('/test/features');

    assert.strictEqual(result.folders[0].test_suites.length, 3);
    assert.strictEqual(result.folders[0].test_suites[0].name, 'login');
    assert.strictEqual(result.folders[0].test_suites[1].name, 'logout');
    assert.strictEqual(result.folders[0].test_suites[2].name, 'register');
  });

  it('should scan nested directory structure', async () => {
    const mockFs = createMockFs({
      '/test/features': {
        type: 'directory',
        children: ['auth', 'payment']
      },
      '/test/features/auth': {
        type: 'directory',
        children: ['login.feature']
      },
      '/test/features/auth/login.feature': { type: 'file' },
      '/test/features/payment': {
        type: 'directory',
        children: ['checkout.feature']
      },
      '/test/features/payment/checkout.feature': { type: 'file' }
    });

    const mockParser = createMockParser((filePath) => ({
      name: path.basename(filePath, '.feature'),
      type: 'feature',
      tags: [],
      before_each: [],
      test_cases: []
    }));

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = await scanner.scanDirectory('/test/features');

    assert.strictEqual(result.folders.length, 2);
    assert.strictEqual(result.folders[0].name, 'auth');
    assert.strictEqual(result.folders[1].name, 'payment');

    // Subdirectories don't get moveTestSuitesToDefaultFolder applied, so test_suites stay in place
    assert.strictEqual(result.folders[0].test_suites.length, 1);
    assert.strictEqual(result.folders[1].test_suites.length, 1);
  });

  it('should throw error when directory does not exist', async () => {
    const mockFs = createMockFs({});
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    await assert.rejects(
      async () => await scanner.scanDirectory('/nonexistent'),
      /Directory \/nonexistent does not exist/
    );
  });

  it('should throw error when path is not a directory', async () => {
    const mockFs = createMockFs({
      '/test/file.txt': { type: 'file' }
    });
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    await assert.rejects(
      async () => await scanner.scanDirectory('/test/file.txt'),
      /Path \/test\/file.txt is not a directory/
    );
  });

  it('should handle empty directory', async () => {
    const mockFs = createMockFs({
      '/test/empty': {
        type: 'directory',
        children: []
      }
    });
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    const result = await scanner.scanDirectory('/test/empty');

    assert.strictEqual(result.name, 'empty');
    assert.strictEqual(result.test_suites.length, 0);
    assert.strictEqual(result.folders.length, 0);
  });

  it('should skip non-feature files', async () => {
    const mockFs = createMockFs({
      '/test/mixed': {
        type: 'directory',
        children: ['test.feature', 'readme.md', 'config.json', 'script.js']
      },
      '/test/mixed/test.feature': { type: 'file' },
      '/test/mixed/readme.md': { type: 'file' },
      '/test/mixed/config.json': { type: 'file' },
      '/test/mixed/script.js': { type: 'file' }
    });

    const mockParser = createMockParser({
      '/test/mixed/test.feature': {
        name: 'Test Feature',
        type: 'feature',
        tags: [],
        before_each: [],
        test_cases: []
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = await scanner.scanDirectory('/test/mixed');

    assert.strictEqual(result.folders[0].test_suites.length, 1);
    assert.strictEqual(result.folders[0].test_suites[0].name, 'Test Feature');
  });

  it('should handle deeply nested folder structure', async () => {
    const mockFs = createMockFs({
      '/root': {
        type: 'directory',
        children: ['level1']
      },
      '/root/level1': {
        type: 'directory',
        children: ['level2']
      },
      '/root/level1/level2': {
        type: 'directory',
        children: ['level3']
      },
      '/root/level1/level2/level3': {
        type: 'directory',
        children: ['deep.feature']
      },
      '/root/level1/level2/level3/deep.feature': { type: 'file' }
    });

    const mockParser = createMockParser({
      '/root/level1/level2/level3/deep.feature': {
        name: 'Deep Feature',
        type: 'feature',
        tags: [],
        before_each: [],
        test_cases: []
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = await scanner.scanDirectory('/root');

    assert.strictEqual(result.folders[0].name, 'level1');
    assert.strictEqual(result.folders[0].folders[0].name, 'level2');
    assert.strictEqual(result.folders[0].folders[0].folders[0].name, 'level3');

    // Only root gets moveTestSuitesToDefaultFolder, subdirectories keep test_suites in place
    assert.strictEqual(result.folders[0].folders[0].folders[0].test_suites.length, 1);
  });

  it('should build folder structure with correct paths', () => {
    const mockFs = createMockFs({
      '/test/features': {
        type: 'directory',
        children: ['test.feature']
      },
      '/test/features/test.feature': { type: 'file' }
    });

    const mockParser = createMockParser({
      '/test/features/test.feature': {
        name: 'Test',
        type: 'feature',
        tags: [],
        before_each: [],
        test_cases: []
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = scanner.buildFolderStructure('/test/features', 'features');

    assert.strictEqual(result.name, 'features');
    assert.strictEqual(result.path, 'features');
    assert.strictEqual(result.test_suites[0].path, path.join('features', 'test.feature'));
  });

  it('should handle directory with mixed files and folders', () => {
    const mockFs = createMockFs({
      '/test/root': {
        type: 'directory',
        children: ['folder1', 'file1.feature', 'folder2', 'file2.feature']
      },
      '/test/root/folder1': {
        type: 'directory',
        children: []
      },
      '/test/root/folder2': {
        type: 'directory',
        children: []
      },
      '/test/root/file1.feature': { type: 'file' },
      '/test/root/file2.feature': { type: 'file' }
    });

    const mockParser = createMockParser((filePath) => ({
      name: path.basename(filePath),
      type: 'feature',
      tags: [],
      before_each: [],
      test_cases: []
    }));

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = scanner.buildFolderStructure('/test/root', 'root');

    assert.strictEqual(result.folders.length, 2);
    assert.strictEqual(result.test_suites.length, 2);
  });

  it('should continue scanning when one file parse fails', () => {
    const mockFs = createMockFs({
      '/test/features': {
        type: 'directory',
        children: ['valid.feature', 'invalid.feature', 'another.feature']
      },
      '/test/features/valid.feature': { type: 'file' },
      '/test/features/invalid.feature': { type: 'file' },
      '/test/features/another.feature': { type: 'file' }
    });

    const mockParser = createMockParser((filePath) => {
      if (filePath.includes('invalid')) {
        throw new Error('Parse error');
      }
      return {
        name: path.basename(filePath),
        type: 'feature',
        tags: [],
        before_each: [],
        test_cases: []
      };
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = scanner.buildFolderStructure('/test/features', 'features');

    assert.strictEqual(result.test_suites.length, 2);
    assert.ok(result.test_suites.find(ts => ts.name === 'valid.feature'));
    assert.ok(result.test_suites.find(ts => ts.name === 'another.feature'));
  });

  it('should move test suites to default folder', () => {
    const structure = {
      name: 'root',
      path: '/root',
      test_suites: [
        { name: 'Suite 1', type: 'feature', tags: [], before_each: [], test_cases: [] },
        { name: 'Suite 2', type: 'feature', tags: [], before_each: [], test_cases: [] }
      ],
      folders: []
    };

    const mockFs = createMockFs({});
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    scanner.moveTestSuitesToDefaultFolder(structure);

    assert.strictEqual(structure.test_suites.length, 0);
    assert.strictEqual(structure.folders.length, 1);
    assert.strictEqual(structure.folders[0].name, 'default');
    assert.strictEqual(structure.folders[0].test_suites.length, 2);
  });

  it('should not create default folder when no test suites exist', () => {
    const structure = {
      name: 'root',
      path: '/root',
      test_suites: [],
      folders: []
    };

    const mockFs = createMockFs({});
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    scanner.moveTestSuitesToDefaultFolder(structure);

    assert.strictEqual(structure.folders.length, 0);
  });

  it('should preserve existing folders when moving test suites', () => {
    const structure = {
      name: 'root',
      path: '/root',
      test_suites: [
        { name: 'Root Suite', type: 'feature', tags: [], before_each: [], test_cases: [] }
      ],
      folders: [
        { name: 'existing', path: 'existing', test_suites: [], folders: [] }
      ]
    };

    const mockFs = createMockFs({});
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    scanner.moveTestSuitesToDefaultFolder(structure);

    assert.strictEqual(structure.folders.length, 2);
    assert.strictEqual(structure.folders[0].name, 'existing');
    assert.strictEqual(structure.folders[1].name, 'default');
  });

  it('should return true for .feature files', () => {
    const mockFs = createMockFs({});
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    assert.strictEqual(scanner.isGherkinFile('test.feature'), true);
    assert.strictEqual(scanner.isGherkinFile('login.feature'), true);
    assert.strictEqual(scanner.isGherkinFile('complex-name.feature'), true);
  });

  it('should return false for non-feature files', () => {
    const mockFs = createMockFs({});
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    assert.strictEqual(scanner.isGherkinFile('test.txt'), false);
    assert.strictEqual(scanner.isGherkinFile('readme.md'), false);
    assert.strictEqual(scanner.isGherkinFile('config.json'), false);
    assert.strictEqual(scanner.isGherkinFile('script.js'), false);
    assert.strictEqual(scanner.isGherkinFile('feature.txt'), false);
  });

  it('should handle files without extension', () => {
    const mockFs = createMockFs({});
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    assert.strictEqual(scanner.isGherkinFile('filename'), false);
    assert.strictEqual(scanner.isGherkinFile('feature'), false);
  });

  it('should handle edge cases', () => {
    const mockFs = createMockFs({});
    const mockParser = createMockParser({});
    const scanner = new ManualTestScanner(mockFs, mockParser);

    assert.strictEqual(scanner.isGherkinFile('.feature'), true);
    assert.strictEqual(scanner.isGherkinFile('file.feature.backup'), false);
    assert.strictEqual(scanner.isGherkinFile(''), false);
  });

  it('should parse gherkin file and format output', () => {
    const mockFs = createMockFs({});
    const mockParser = createMockParser({
      '/test/login.feature': {
        name: 'Login Feature',
        type: 'feature',
        tags: ['@smoke', '@critical'],
        before_each: [
          { type: 'background', steps: [{ name: 'Given setup' }] }
        ],
        test_cases: [
          { name: 'Login test', type: 'scenario', tags: [], steps: [] }
        ]
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = scanner.parseGherkinFile('/test/login.feature', 'features/login.feature');

    assert.strictEqual(result.name, 'Login Feature');
    assert.strictEqual(result.type, 'feature');
    assert.deepStrictEqual(result.tags, ['@smoke', '@critical']);
    assert.strictEqual(result.before_each.length, 1);
    assert.strictEqual(result.path, 'features/login.feature');
    assert.strictEqual(result.test_cases.length, 1);
  });

  it('should handle gherkin file without test cases', () => {
    const mockFs = createMockFs({});
    const mockParser = createMockParser({
      '/test/empty.feature': {
        name: 'Empty Feature',
        type: 'feature',
        tags: [],
        before_each: []
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = scanner.parseGherkinFile('/test/empty.feature', 'empty.feature');

    assert.strictEqual(result.name, 'Empty Feature');
    assert.strictEqual(result.test_cases.length, 0);
  });

  it('should include relative path in output', () => {
    const mockFs = createMockFs({});
    const mockParser = createMockParser({
      '/root/sub/nested/file.feature': {
        name: 'Nested Feature',
        type: 'feature',
        tags: [],
        before_each: [],
        test_cases: []
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = scanner.parseGherkinFile(
      '/root/sub/nested/file.feature',
      'features/sub/nested/file.feature'
    );

    assert.strictEqual(result.path, 'features/sub/nested/file.feature');
  });

  it('should preserve all parser output fields', () => {
    const mockFs = createMockFs({});
    const mockParser = createMockParser({
      '/test/complete.feature': {
        name: 'Complete Feature',
        type: 'feature',
        tags: ['@tag1', '@tag2'],
        before_each: [
          {
            type: 'background',
            steps: [
              { name: 'Given background step 1' },
              { name: 'And background step 2' }
            ]
          }
        ],
        test_cases: [
          {
            name: 'Scenario 1',
            type: 'scenario',
            tags: ['@scenario-tag'],
            steps: [
              { name: 'Given step 1' },
              { name: 'When step 2' },
              { name: 'Then step 3' }
            ]
          }
        ]
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = scanner.parseGherkinFile('/test/complete.feature', 'complete.feature');

    assert.strictEqual(result.name, 'Complete Feature');
    assert.strictEqual(result.type, 'feature');
    assert.deepStrictEqual(result.tags, ['@tag1', '@tag2']);
    assert.strictEqual(result.before_each.length, 1);
    assert.strictEqual(result.before_each[0].steps.length, 2);
    assert.strictEqual(result.test_cases.length, 1);
    assert.strictEqual(result.test_cases[0].steps.length, 3);
  });

  it('should handle complex real-world folder structure', async () => {
    const mockFs = createMockFs({
      '/project/tests': {
        type: 'directory',
        children: ['smoke', 'regression', 'common.feature']
      },
      '/project/tests/smoke': {
        type: 'directory',
        children: ['login.feature', 'logout.feature']
      },
      '/project/tests/smoke/login.feature': { type: 'file' },
      '/project/tests/smoke/logout.feature': { type: 'file' },
      '/project/tests/regression': {
        type: 'directory',
        children: ['payment', 'profile.feature']
      },
      '/project/tests/regression/payment': {
        type: 'directory',
        children: ['checkout.feature']
      },
      '/project/tests/regression/payment/checkout.feature': { type: 'file' },
      '/project/tests/regression/profile.feature': { type: 'file' },
      '/project/tests/common.feature': { type: 'file' }
    });

    const mockParser = createMockParser((filePath) => ({
      name: path.basename(filePath, '.feature'),
      type: 'feature',
      tags: [],
      before_each: [],
      test_cases: []
    }));

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = await scanner.scanDirectory('/project/tests');

    assert.strictEqual(result.name, 'tests');
    assert.strictEqual(result.test_suites.length, 0);
    assert.strictEqual(result.folders.length, 3);

    // Check default folder for root-level test suite
    const defaultFolder = result.folders.find(f => f.name === 'default');
    assert.ok(defaultFolder);
    assert.strictEqual(defaultFolder.test_suites.length, 1);
    assert.strictEqual(defaultFolder.test_suites[0].name, 'common');

    // Check smoke folder - subdirectories keep test_suites directly
    const smokeFolder = result.folders.find(f => f.name === 'smoke');
    assert.ok(smokeFolder);
    assert.strictEqual(smokeFolder.test_suites.length, 2);

    // Check regression folder with nested structure
    const regressionFolder = result.folders.find(f => f.name === 'regression');
    assert.ok(regressionFolder);
    // regression has payment subfolder and profile.feature test suite (which stays in test_suites, not moved to default)
    assert.strictEqual(regressionFolder.folders.length, 1); // only payment subfolder
    assert.strictEqual(regressionFolder.test_suites.length, 1); // profile.feature
  });

  it('should handle directory with only subdirectories', async () => {
    const mockFs = createMockFs({
      '/root': {
        type: 'directory',
        children: ['folder1', 'folder2']
      },
      '/root/folder1': {
        type: 'directory',
        children: ['test.feature']
      },
      '/root/folder1/test.feature': { type: 'file' },
      '/root/folder2': {
        type: 'directory',
        children: []
      }
    });

    const mockParser = createMockParser({
      '/root/folder1/test.feature': {
        name: 'Test',
        type: 'feature',
        tags: [],
        before_each: [],
        test_cases: []
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = await scanner.scanDirectory('/root');

    assert.strictEqual(result.test_suites.length, 0);
    assert.strictEqual(result.folders.length, 2);

    // folder1 has a test suite directly (no default folder for subdirectories)
    assert.strictEqual(result.folders[0].test_suites.length, 1);

    // folder2 is empty
    assert.strictEqual(result.folders[1].test_suites.length, 0);
    assert.strictEqual(result.folders[1].folders.length, 0);
  });

  it('should handle relative path resolution correctly', async () => {
    const mockFs = createMockFs({
      '/absolute/path/features': {
        type: 'directory',
        children: ['test.feature']
      },
      '/absolute/path/features/test.feature': { type: 'file' }
    });

    const mockParser = createMockParser({
      '/absolute/path/features/test.feature': {
        name: 'Test',
        type: 'feature',
        tags: [],
        before_each: [],
        test_cases: []
      }
    });

    const scanner = new ManualTestScanner(mockFs, mockParser);
    const result = await scanner.scanDirectory('/absolute/path/features');

    assert.strictEqual(result.path, '/absolute/path/features');
    assert.ok(result.folders[0].test_suites[0].path.includes('test.feature'));
  });
});

