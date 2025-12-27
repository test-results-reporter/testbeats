const { ManualTestHasher } = require('../src/manual/hasher');
const assert = require('assert');

describe('ManualTestHasher', () => {
  it('should hash a test case correctly', () => {
    const hasher = new ManualTestHasher();
    const testCase = {
      name: 'Test Case',
      type: 'scenario',
      tags: ['@smoke'],
      steps: ['Given I have a test case'],
    };
    const hash = hasher.hashTestCase(testCase);
    assert.strictEqual(hash, '0a57a7661228eaa7507055e6cdc5d3f9');
  });

  it('should hash a test suite correctly', () => {
    const hasher = new ManualTestHasher();
    const testSuite = {
      name: 'Test Suite',
      type: 'feature',
      tags: ['@smoke'],
      test_cases: [
        {
          hash: '0a57a7661228eaa7507055e6cdc5d3f9',
        }
      ],
    };
    const hash = hasher.hashTestSuite(testSuite);
    assert.strictEqual(hash, 'b56c0818b3fb5f1de1494e9794fc496b');
  });

  it('should hash a folder correctly', () => {
    const hasher = new ManualTestHasher();
    const folder = {
      name: 'Test Folder',
      path: 'test/data/gherkin',
      test_suites: [
        {
          hash: 'b56c0818b3fb5f1de1494e9794fc496b',
        }
      ],
      folders: [
        {
          hash: '0a57a7661228eaa7507055e6cdc5d3f9',
        }
      ],
    };
    const hash = hasher.hashFolder(folder);
    assert.strictEqual(hash, '3e77d1691ce17ea4f142df6e091d1943');
  });

  it('should hash a structure correctly', () => {
    const hasher = new ManualTestHasher();
    const structure = {
      name: 'Test Structure',
      path: 'test/data/gherkin',
      test_suites: [
        {
          name: 'Test Suite',
          type: 'feature',
          tags: ['@smoke'],
          test_cases: [
            {
              name: 'Test Case',
              type: 'scenario',
              tags: ['@smoke'],
              steps: ['Given I have a test case'],
            }
          ],
        }
      ],
      folders: [],
    };
    const folderStructure = hasher.hashStructure(structure);
    assert.strictEqual(folderStructure.hash, 'a5ecf37b60a55c1b623b6edc896dceb9');
    assert.strictEqual(folderStructure.test_suites[0].hash, 'b56c0818b3fb5f1de1494e9794fc496b');
    assert.strictEqual(folderStructure.test_suites[0].test_cases[0].hash, '0a57a7661228eaa7507055e6cdc5d3f9');
  });

  it('should produce same hash for identical test cases', () => {
    const hasher = new ManualTestHasher();
    const testCase1 = {
      name: 'Login Test',
      type: 'scenario',
      tags: ['@critical'],
      steps: ['Given user navigates to login', 'When user enters credentials'],
      path: 'features/login.feature'
    };
    const testCase2 = {
      name: 'Login Test',
      type: 'scenario',
      tags: ['@critical'],
      steps: ['Given user navigates to login', 'When user enters credentials'],
      path: 'features/login.feature'
    };
    assert.strictEqual(hasher.hashTestCase(testCase1), hasher.hashTestCase(testCase2));
  });

  it('should produce different hash when test case name changes', () => {
    const hasher = new ManualTestHasher();
    const testCase1 = {
      name: 'Login Test',
      type: 'scenario',
      tags: ['@smoke'],
      steps: ['Given I have a test case']
    };
    const testCase2 = {
      name: 'Login Test Modified',
      type: 'scenario',
      tags: ['@smoke'],
      steps: ['Given I have a test case']
    };
    assert.notStrictEqual(hasher.hashTestCase(testCase1), hasher.hashTestCase(testCase2));
  });

  it('should produce different hash when test case steps change', () => {
    const hasher = new ManualTestHasher();
    const testCase1 = {
      name: 'Test Case',
      type: 'scenario',
      tags: ['@smoke'],
      steps: ['Step 1', 'Step 2']
    };
    const testCase2 = {
      name: 'Test Case',
      type: 'scenario',
      tags: ['@smoke'],
      steps: ['Step 1', 'Step 2', 'Step 3']
    };
    assert.notStrictEqual(hasher.hashTestCase(testCase1), hasher.hashTestCase(testCase2));
  });

  it('should produce different hash when test case tags change', () => {
    const hasher = new ManualTestHasher();
    const testCase1 = {
      name: 'Test Case',
      type: 'scenario',
      tags: ['@smoke'],
      steps: ['Given I have a test case']
    };
    const testCase2 = {
      name: 'Test Case',
      type: 'scenario',
      tags: ['@regression'],
      steps: ['Given I have a test case']
    };
    assert.notStrictEqual(hasher.hashTestCase(testCase1), hasher.hashTestCase(testCase2));
  });

  it('should use custom hashing algorithm', () => {
    const hasherMd5 = new ManualTestHasher('md5');
    const hasherSha1 = new ManualTestHasher('sha1');
    const testCase = {
      name: 'Test Case',
      type: 'scenario',
      tags: ['@smoke'],
      steps: ['Given I have a test case']
    };
    const hashMd5 = hasherMd5.hashTestCase(testCase);
    const hashSha1 = hasherSha1.hashTestCase(testCase);
    assert.notStrictEqual(hashMd5, hashSha1);
    assert.strictEqual(hashMd5.length, 32); // MD5 is 32 chars
    assert.strictEqual(hashSha1.length, 40); // SHA1 is 40 chars
  });

  it('should hash nested folder structure with multiple levels', () => {
    const hasher = new ManualTestHasher();
    const structure = {
      name: 'Root',
      path: 'test/features',
      test_suites: [],
      folders: [
        {
          name: 'SubFolder',
          path: 'test/features/sub',
          test_suites: [
            {
              name: 'Nested Suite',
              type: 'feature',
              tags: [],
              test_cases: [
                {
                  name: 'Nested Test',
                  type: 'scenario',
                  tags: [],
                  steps: ['Step 1']
                }
              ]
            }
          ],
          folders: []
        }
      ]
    };
    const result = hasher.hashStructure(structure);
    assert.ok(result.hash);
    assert.ok(result.folders[0].hash);
    assert.ok(result.folders[0].test_suites[0].hash);
    assert.ok(result.folders[0].test_suites[0].test_cases[0].hash);
  });

  it('should handle test suite with empty test_cases array', () => {
    const hasher = new ManualTestHasher();
    const testSuite = {
      name: 'Empty Suite',
      type: 'feature',
      tags: [],
      test_cases: []
    };
    const hash = hasher.hashTestSuite(testSuite);
    assert.ok(hash);
    assert.strictEqual(typeof hash, 'string');
  });

  it('should handle folder with empty test_suites and folders arrays', () => {
    const hasher = new ManualTestHasher();
    const folder = {
      name: 'Empty Folder',
      path: 'test/empty',
      test_suites: [],
      folders: []
    };
    const hash = hasher.hashFolder(folder);
    assert.ok(hash);
    assert.strictEqual(typeof hash, 'string');
  });

  it('should produce different hash when test suite before_each changes', () => {
    const hasher = new ManualTestHasher();
    const testSuite1 = {
      name: 'Suite',
      type: 'feature',
      tags: [],
      before_each: ['Setup step 1'],
      test_cases: []
    };
    const testSuite2 = {
      name: 'Suite',
      type: 'feature',
      tags: [],
      before_each: ['Setup step 2'],
      test_cases: []
    };
    assert.notStrictEqual(hasher.hashTestSuite(testSuite1), hasher.hashTestSuite(testSuite2));
  });

  it('should handle generic hash method for any object', () => {
    const hasher = new ManualTestHasher();
    const obj1 = { key: 'value', nested: { prop: 123 } };
    const obj2 = { key: 'value', nested: { prop: 123 } };
    const obj3 = { key: 'different', nested: { prop: 123 } };
    assert.strictEqual(hasher.hash(obj1), hasher.hash(obj2));
    assert.notStrictEqual(hasher.hash(obj1), hasher.hash(obj3));
  });
});