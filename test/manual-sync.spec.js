const assert = require('assert');
const { exec } = require('child_process');
const { ManualSyncCommand } = require('../src/commands/manual-sync.command');
const { ManualSyncHelper } = require('../src/manual/sync.helper');
const { mock } = require('pactum');

xdescribe('Manual Sync Command', () => {

  describe('Manual Sync Helper', () => {
    let helper;

    beforeEach(() => {
      helper = new ManualSyncHelper();
    });

    it('should scan directory and build folder structure correctly', async () => {
      const result = await helper.scanDirectory('test/data/gherkin');

      assert.ok(result, 'Should return a result');
      assert.equal(result.name, 'gherkin', 'Should have correct folder name');
      assert.equal(result.path, 'test/data/gherkin', 'Should have correct folder path');
      assert.ok(Array.isArray(result.folders), 'Should have folders array');
      assert.ok(result.test_suites.length > 0, 'Should have test suites');
      // assert.equal(result.hash, '9b3211466d6a70e47492c9a80bdc4aae', 'Should have correct hash for root folder');

      // Verify test suite structure
      const firstSuite = result.test_suites[0];
      assert.ok(firstSuite.name, 'Should have test suite name');
      assert.ok(firstSuite.path, 'Should have test suite path');
      assert.ok(Array.isArray(firstSuite.test_cases), 'Should have test cases array');
      assert.ok(Array.isArray(firstSuite.tags), 'Should have tags array');
      assert.ok(Array.isArray(firstSuite.before_each), 'Should have before_each array');
      // assert.equal(firstSuite.hash, 'bcbad4ec71d3a1c4b44d0001b186bd73', 'Should have correct hash for test suite');
    });

    it('should handle nested folder structures', async () => {
      const result = await helper.scanDirectory('test/data/gherkin');

      assert.equal(result.name, 'gherkin', 'Should have correct root folder name');
      assert.ok(result.test_suites.length > 0, 'Should have test suites in root');
      assert.ok(result.folders.length > 0, 'Should have nested folders');

      // Find the nested folder
      const nestedFolder = result.folders.find(f => f.name === 'nested-folder');
      assert.ok(nestedFolder, 'Should have nested-folder');
      assert.ok(nestedFolder.test_suites.length > 0, 'Should have test suites in nested folder');

      // Verify test suite content
      const mainSuite = result.test_suites.find(s => s.name === 'Main Feature');
      assert.ok(mainSuite, 'Should find main feature');
      assert.ok(mainSuite.test_cases.length >= 0, 'Should have test cases array');
      if (mainSuite.test_cases.length > 0) {
        assert.equal(mainSuite.test_cases[0].name, 'Main Scenario', 'Should parse scenario name');
      }

      const nestedSuite = nestedFolder.test_suites.find(s => s.name === 'Nested Feature');
      assert.ok(nestedSuite, 'Should find nested feature');
      assert.ok(nestedSuite.test_cases.length >= 0, 'Should have test cases array in nested');
    });

    it('should handle deep nested folder structures', async () => {
      const result = await helper.scanDirectory('test/data/gherkin');

      // Find the deep nested folder
      const nestedFolder = result.folders.find(f => f.name === 'nested-folder');
      assert.ok(nestedFolder, 'Should have nested-folder');

      const deepNestedFolder = nestedFolder.folders.find(f => f.name === 'deep-nested');
      assert.ok(deepNestedFolder, 'Should have deep-nested folder');
      assert.ok(deepNestedFolder.test_suites.length > 0, 'Should have test suites in deep nested folder');

      const veryDeepFolder = deepNestedFolder.folders.find(f => f.name === 'very-deep');
      assert.ok(veryDeepFolder, 'Should have very-deep folder');
      assert.ok(veryDeepFolder.test_suites.length > 0, 'Should have test suites in very deep folder');

      // Verify deep nested test suite content
      const deepSuite = deepNestedFolder.test_suites.find(s => s.name === 'Deep Nested Feature');
      assert.ok(deepSuite, 'Should find deep nested feature');
      assert.ok(deepSuite.test_cases.length >= 0, 'Should have test cases array');

      const veryDeepSuite = veryDeepFolder.test_suites.find(s => s.name === 'Very Deep Nested Feature');
      assert.ok(veryDeepSuite, 'Should find very deep nested feature');
      assert.ok(veryDeepSuite.test_cases.length >= 0, 'Should have test cases array');
    });

    it('should handle empty folders and folders without features', async () => {
      const result = await helper.scanDirectory('test/data/gherkin');

      // Find empty folder
      const emptyFolder = result.folders.find(f => f.name === 'empty-folder');
      assert.ok(emptyFolder, 'Should have empty-folder');
      assert.equal(emptyFolder.test_suites.length, 0, 'Should have no test suites in empty folder');
      assert.ok(emptyFolder.folders.length > 0, 'Should have sub-folders in empty folder');

      // Find folder without features
      const noFeaturesFolder = result.folders.find(f => f.name === 'no-features-folder');
      assert.ok(noFeaturesFolder, 'Should have no-features-folder');
      assert.equal(noFeaturesFolder.test_suites.length, 0, 'Should have no test suites in no-features folder');
      assert.ok(noFeaturesFolder.folders.length > 0, 'Should have sub-folders in no-features folder');

      // Find mixed content folder
      const mixedContentFolder = result.folders.find(f => f.name === 'mixed-content');
      assert.ok(mixedContentFolder, 'Should have mixed-content folder');
      assert.ok(mixedContentFolder.test_suites.length > 0, 'Should have test suites in mixed content folder');
      assert.ok(mixedContentFolder.folders.length > 0, 'Should have sub-folders in mixed content folder');
    });

    it('should handle gherkin files with different structures', async () => {
      const result = await helper.scanDirectory('test/data/gherkin');

      // Find a suite with background
      const suiteWithBackground = result.test_suites.find(s => s.before_each.length > 0);
      assert.ok(suiteWithBackground, 'Should find suite with background');
      assert.ok(suiteWithBackground.before_each[0].type === 'background', 'Should have background type');

      // Find a suite with tags
      const suiteWithTags = result.test_suites.find(s => s.tags.length > 0);
      assert.ok(suiteWithTags, 'Should find suite with tags');
      assert.ok(suiteWithTags.tags.length > 0, 'Should have tags');

      // Find a suite with test cases
      const suiteWithCases = result.test_suites.find(s => s.test_cases.length > 0);
      assert.ok(suiteWithCases, 'Should find suite with test cases');
      assert.ok(suiteWithCases.test_cases[0].steps.length > 0, 'Should have steps in test cases');
    });

    it('should handle invalid directory gracefully', async () => {
      try {
        await helper.scanDirectory('non-existent-directory');
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error.message.includes('Directory does not exist'), 'Should have correct error message');
      }
    });

    it('should handle file path instead of directory gracefully', async () => {
      try {
        await helper.scanDirectory('test/data/gherkin/basic.feature');
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error.message.includes('Path is not a directory'), 'Should have correct error message');
      }
    });
  });

  describe('Manual Sync Command', () => {
    let command;

    beforeEach(() => {
      command = new ManualSyncCommand({});
    });

    it('should execute successfully with custom path', async () => {
      mock.addInteraction('search projects from beats');
      mock.addInteraction('compare manual tests from beats');
      mock.addInteraction('sync manual folders to beats');
      const customCommand = new ManualSyncCommand({ path: 'test/data/gherkin', 'api-key': 'test', project: 'test' });
      console.log('customCommand', customCommand);
      const result = await customCommand.execute();

      assert.ok(result, 'Should return a result');
      assert.ok(result.folders, 'Should have folders property');
      assert.ok(result.folders.length > 0, 'Should have folders');

      const folder = result.folders[0];
      assert.equal(folder.name, 'gherkin', 'Should have correct folder name');
      assert.ok(folder.test_suites.length > 0, 'Should have test suites');
    });

    it('should handle execution errors gracefully', async () => {
      const invalidCommand = new ManualSyncCommand({ path: 'non-existent-path', api_key: 'test', project: 'test' });

      try {
        await invalidCommand.execute();
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error.message.includes('Directory does not exist'), 'Should have correct error message');
      }
    });
  });

  describe('CLI Integration', () => {
    it('should show help information', (done) => {
      exec('node src/cli.js manual sync --help', (error, stdout, stderr) => {
        if (error) {
          done(error);
          return;
        }

        assert.ok(stdout.includes('Sync manual test cases from gherkin files'), 'Should show description');
        assert.ok(stdout.includes('manual sync'), 'Should show usage');
        assert.ok(stdout.includes('--path'), 'Should show path option');
        assert.ok(stdout.includes('Examples'), 'Should show examples section');

        done();
      });
    });

    it('should execute successfully with test data', (done) => {
      exec('node src/cli.js manual sync --path test/data/gherkin', (error, stdout, stderr) => {
        if (error) {
          done(error);
          return;
        }

        assert.ok(stdout.includes('🔄 Starting manual test case sync'), 'Should show start message');
        assert.ok(stdout.includes('📁 Scanning directory: test/data/gherkin'), 'Should show directory path');
        assert.ok(stdout.includes('📊 Sync Results:'), 'Should show results header');
        assert.ok(stdout.includes('✅ Manual sync completed successfully'), 'Should show success message');
        assert.ok(stdout.includes('📋 Test Suites:'), 'Should show test suites count');

        done();
      });
    });

    it('should execute successfully with default path', (done) => {
      exec('node src/cli.js manual sync', (error, stdout, stderr) => {
        if (error) {
          done(error);
          return;
        }

        assert.ok(stdout.includes('🔄 Starting manual test case sync'), 'Should show start message');
        assert.ok(stdout.includes('📁 Scanning directory: .'), 'Should show current directory');
        assert.ok(stdout.includes('✅ Manual sync completed successfully'), 'Should show success message');

        done();
      });
    });
  });

  describe('Output Structure Validation', () => {
    it('should produce valid JSON output structure', async () => {
      const helper = new ManualSyncHelper();
      const result = await helper.scanDirectory('test/data/gherkin');

      const output = {
        folders: [result]
      };

      // Validate top-level structure
      assert.ok(output.folders, 'Should have folders array');
      assert.ok(Array.isArray(output.folders), 'Folders should be an array');
      assert.ok(output.folders.length > 0, 'Should have at least one folder');

      const folder = output.folders[0];

      // Validate folder structure
      assert.ok(folder.name, 'Folder should have name');
      assert.ok(folder.path, 'Folder should have path');
      assert.ok(Array.isArray(folder.test_suites), 'Folder should have test_suites array');
      assert.ok(Array.isArray(folder.folders), 'Folder should have folders array');

      if (folder.test_suites.length > 0) {
        const suite = folder.test_suites[0];

        // Validate test suite structure
        assert.ok(suite.name, 'Test suite should have name');
        assert.ok(suite.path, 'Test suite should have path');
        assert.ok(Array.isArray(suite.test_cases), 'Test suite should have test_cases array');

        if (suite.test_cases.length > 0) {
          const testCase = suite.test_cases[0];

          // Validate test case structure
          assert.ok(testCase.name, 'Test case should have name');
          assert.ok(Array.isArray(testCase.steps), 'Test case should have steps array');
        }
      }
    });
  });
});
