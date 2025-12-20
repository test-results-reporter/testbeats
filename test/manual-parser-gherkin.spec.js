const { GherkinParser } = require('../src/manual/parsers/gherkin.js');
const assert = require('assert');

describe('Gherkin Parser', () => {
  let parser;

  beforeEach(() => {
    parser = new GherkinParser();
  });

  it('should parse a basic feature file correctly', () => {
    // Arrange
    const filePath = './test/data/gherkin/basic.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'Basic Calculator Operations');

    // Check feature tags
    assert.ok(Array.isArray(result.tags), 'Feature tags should be an array');
    assert.strictEqual(result.tags.length, 2);
    assert.strictEqual(result.tags[0], '@smoke');
    assert.strictEqual(result.tags[1], '@regression');

    // Check scenarios
    assert.ok(Array.isArray(result.test_cases), 'Feature should have test cases');
    assert.strictEqual(result.test_cases.length, 2, 'Should have 2 scenarios');

    // Check first scenario
    const firstScenario = result.test_cases[0];
    assert.strictEqual(firstScenario.type, 'scenario');
    assert.strictEqual(firstScenario.name, 'Addition of two numbers');
    assert.ok(Array.isArray(firstScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(firstScenario.tags.length, 2);
    assert.strictEqual(firstScenario.tags[0], '@positive');
    assert.strictEqual(firstScenario.tags[1], '@math');

    // Check steps
    assert.ok(Array.isArray(firstScenario.steps), 'Scenario should have steps');
    assert.strictEqual(firstScenario.steps.length, 4, 'Should have 4 steps');

    // Check first step
    const firstStep = firstScenario.steps[0];
    assert.strictEqual(firstStep.name, 'Given I have number 5 in calculator');

    // Check 'And' step
    const secondStep = firstScenario.steps[1];
    assert.strictEqual(secondStep.name, 'And I have number 3 in calculator');

    // Check 'When' step
    const thirdStep = firstScenario.steps[2];
    assert.strictEqual(thirdStep.name, 'When I add the numbers');

    // Check 'Then' step
    const fourthStep = firstScenario.steps[3];
    assert.strictEqual(fourthStep.name, 'Then I should see result 8');
  });

  it('should parse a complex feature file', () => {
    // Arrange
    const filePath = './test/data/gherkin/complex.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'User Management System');

    // Check feature tags
    assert.ok(Array.isArray(result.tags), 'Feature tags should be an array');
    assert.strictEqual(result.tags.length, 2);
    assert.strictEqual(result.tags[0], '@e2e');
    assert.strictEqual(result.tags[1], '@api');

    // Check scenarios
    assert.ok(Array.isArray(result.test_cases), 'Feature should have test cases');
    assert.strictEqual(result.test_cases.length, 4, 'Should have 4 scenarios');

    // Check background
    const background = result.before_each[0];
    assert.strictEqual(background.type, 'background');
    assert.ok(Array.isArray(background.steps), 'Background should have steps');
    assert.strictEqual(background.steps.length, 2, 'Background should have 2 steps');

    // Check first scenario (Create)
    const createScenario = result.test_cases[0];
    assert.strictEqual(createScenario.type, 'scenario');
    assert.strictEqual(createScenario.name, 'Create a new user');
    assert.ok(Array.isArray(createScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(createScenario.tags.length, 2);
    assert.strictEqual(createScenario.tags[0], '@create');
    assert.strictEqual(createScenario.tags[1], '@positive');

    // Check create scenario steps
    assert.ok(Array.isArray(createScenario.steps), 'Scenario should have steps');
    assert.strictEqual(createScenario.steps.length, 5, 'Should have 5 steps');

    // Check 'But' step in read scenario
    const readScenario = result.test_cases[1];
    assert.strictEqual(readScenario.name, 'Retrieve user information');
    assert.ok(Array.isArray(readScenario.steps), 'Read scenario should have steps');

    // Find the 'But' step
    const butStep = readScenario.steps.find(step => step.name.includes('should not see the user\'s password'));
    assert.ok(butStep, 'Should have a But step');
    assert.strictEqual(butStep.name, 'But I should not see the user\'s password');

    // Check update scenario
    const updateScenario = result.test_cases[2];
    assert.strictEqual(updateScenario.name, 'Update user information');
    assert.ok(Array.isArray(updateScenario.steps), 'Update scenario should have steps');

    // Check delete scenario
    const deleteScenario = result.test_cases[3];
    assert.strictEqual(deleteScenario.name, 'Delete non-existent user');
    assert.ok(Array.isArray(deleteScenario.tags), 'Delete scenario should have tags');
    assert.strictEqual(deleteScenario.tags.length, 2);
    assert.strictEqual(deleteScenario.tags[0], '@delete');
    assert.strictEqual(deleteScenario.tags[1], '@negative');
  });

  it('should parse a feature file without tags correctly', () => {
    // Arrange
    const filePath = './test/data/gherkin/no-tags.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'No Tags');

    // Check feature tags - should be empty array
    assert.ok(Array.isArray(result.tags), 'Feature tags should be an array');
    assert.strictEqual(result.tags.length, 0, 'Feature should have no tags');

    // Check scenarios
    assert.ok(Array.isArray(result.test_cases), 'Feature should have test cases');
    assert.strictEqual(result.test_cases.length, 1, 'Should have 1 scenario');

    // Check scenario
    const scenario = result.test_cases[0];
    assert.strictEqual(scenario.type, 'scenario');
    assert.strictEqual(scenario.name, 'No Tags Scenario');

    // Check scenario tags - should be empty array
    assert.ok(Array.isArray(scenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(scenario.tags.length, 0, 'Scenario should have no tags');

    // Check steps
    assert.ok(Array.isArray(scenario.steps), 'Scenario should have steps');
    assert.strictEqual(scenario.steps.length, 3, 'Should have 3 steps');

    // Check first step
    const firstStep = scenario.steps[0];
    assert.strictEqual(firstStep.name, 'Given I have a simple step');

    // Check second step
    const secondStep = scenario.steps[1];
    assert.strictEqual(secondStep.name, 'When I do something simple');

    // Check third step
    const thirdStep = scenario.steps[2];
    assert.strictEqual(thirdStep.name, 'Then I see simple results');
  });

  it('should parse a feature file with scenarios without steps correctly', () => {
    // Arrange
    const filePath = './test/data/gherkin/no-steps.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'No Steps');

    // Check feature tags
    assert.ok(Array.isArray(result.tags), 'Feature tags should be an array');
    assert.strictEqual(result.tags.length, 1, 'Feature should have 1 tag');
    assert.strictEqual(result.tags[0], '@simple');

    // Check scenarios
    assert.ok(Array.isArray(result.test_cases), 'Feature should have test cases');
    assert.strictEqual(result.test_cases.length, 10, 'Should have 10 scenarios');

    // Check first scenario
    const firstScenario = result.test_cases[0];
    assert.strictEqual(firstScenario.type, 'scenario');
    assert.strictEqual(firstScenario.name, 'No Steps Scenario One');

    // Check scenario tags - should be empty array
    assert.ok(Array.isArray(firstScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(firstScenario.tags.length, 0, 'Scenario should have no tags');

    // Check steps - should be empty array
    assert.ok(Array.isArray(firstScenario.steps), 'Scenario should have steps array');
    assert.strictEqual(firstScenario.steps.length, 0, 'Scenario should have no steps');

    // Check last scenario
    const lastScenario = result.test_cases[9];
    assert.strictEqual(lastScenario.type, 'scenario');
    assert.strictEqual(lastScenario.name, 'No Steps Scenario Ten');

    // Check last scenario has no steps
    assert.ok(Array.isArray(lastScenario.steps), 'Last scenario should have steps array');
    assert.strictEqual(lastScenario.steps.length, 0, 'Last scenario should have no steps');

    // Verify all scenarios have no steps
    result.test_cases.forEach((scenario, index) => {
      assert.strictEqual(scenario.type, 'scenario', `Scenario ${index + 1} should be of type scenario`);
      assert.ok(Array.isArray(scenario.steps), `Scenario ${index + 1} should have steps array`);
      assert.strictEqual(scenario.steps.length, 0, `Scenario ${index + 1} should have no steps`);
    });
  });

  it('should parse a feature file with comments correctly', () => {
    // Arrange
    const filePath = './test/data/gherkin/comments.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'Comment Examples in Gherkin');

    // Check feature tags
    assert.ok(Array.isArray(result.tags), 'Feature tags should be an array');
    assert.strictEqual(result.tags.length, 3, 'Feature should have 3 tags');
    assert.strictEqual(result.tags[0], '@comments');
    assert.strictEqual(result.tags[1], '@example');
    assert.strictEqual(result.tags[2], '@documentation');

    // Check scenarios
    assert.ok(Array.isArray(result.test_cases), 'Feature should have test cases');
    assert.strictEqual(result.test_cases.length, 2, 'Should have 2 scenarios');

    // Check Background
    const background = result.before_each[0];
    assert.strictEqual(background.type, 'background');
    assert.ok(Array.isArray(background.steps), 'Background should have steps');
    assert.strictEqual(background.steps.length, 2, 'Background should have 2 steps');

    // Check Background steps
    const backgroundStep1 = background.steps[0];
    assert.strictEqual(backgroundStep1.name, 'Given I have a test environment set up');

    const backgroundStep2 = background.steps[1];
    assert.strictEqual(backgroundStep2.name, 'And I am ready to run tests');

    // Check first scenario (Basic comment usage)
    const firstScenario = result.test_cases[0];
    assert.strictEqual(firstScenario.type, 'scenario');
    assert.strictEqual(firstScenario.name, 'Basic comment usage');
    assert.ok(Array.isArray(firstScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(firstScenario.tags.length, 2, 'Scenario should have 2 tags');
    assert.strictEqual(firstScenario.tags[0], '@positive');
    assert.strictEqual(firstScenario.tags[1], '@basic');

    // Check first scenario steps
    assert.ok(Array.isArray(firstScenario.steps), 'Scenario should have steps');
    assert.strictEqual(firstScenario.steps.length, 4, 'Should have 4 steps');

    // Check first scenario step details
    const firstStep = firstScenario.steps[0];
    assert.strictEqual(firstStep.name, 'Given I have a feature file open');

    const secondStep = firstScenario.steps[1];
    assert.strictEqual(secondStep.name, 'When I add comments to explain the steps');

    const thirdStep = firstScenario.steps[2];
    assert.strictEqual(thirdStep.name, 'Then I should see clear documentation');

    const fourthStep = firstScenario.steps[3];
    assert.strictEqual(fourthStep.name, 'And the code should be more maintainable');

    // Check second scenario (Advanced comment patterns)
    const secondScenario = result.test_cases[1];
    assert.strictEqual(secondScenario.type, 'scenario');
    assert.strictEqual(secondScenario.name, 'Advanced comment patterns');
    assert.ok(Array.isArray(secondScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(secondScenario.tags.length, 2, 'Scenario should have 2 tags');
    assert.strictEqual(secondScenario.tags[0], '@negative');
    assert.strictEqual(secondScenario.tags[1], '@advanced');

    // Check second scenario steps
    assert.ok(Array.isArray(secondScenario.steps), 'Scenario should have steps');
    assert.strictEqual(secondScenario.steps.length, 3, 'Should have 3 steps');

    // Check second scenario step details
    const secondScenarioStep1 = secondScenario.steps[0];
    assert.strictEqual(secondScenarioStep1.name, 'Given I have a complex test flow');

    const secondScenarioStep2 = secondScenario.steps[1];
    assert.strictEqual(secondScenarioStep2.name, 'When I execute the test');

    const secondScenarioStep3 = secondScenario.steps[2];
    assert.strictEqual(secondScenarioStep3.name, 'Then I should see the expected results');
  });

  it('should parse a feature file with background correctly', () => {
    // Arrange
    const filePath = './test/data/gherkin/background.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'Background Section Examples');

    // Check feature tags
    assert.ok(Array.isArray(result.tags), 'Feature tags should be an array');
    assert.strictEqual(result.tags.length, 3, 'Feature should have 3 tags');
    assert.strictEqual(result.tags[0], '@background');
    assert.strictEqual(result.tags[1], '@example');
    assert.strictEqual(result.tags[2], '@setup');

    // Check scenarios
    assert.ok(Array.isArray(result.test_cases), 'Feature should have test cases');
    assert.strictEqual(result.test_cases.length, 2, 'Should have 2 scenarios');

    // Check Background
    const background = result.before_each[0];
    assert.strictEqual(background.type, 'background');
    assert.ok(Array.isArray(background.steps), 'Background should have steps');
    assert.strictEqual(background.steps.length, 4, 'Background should have 4 steps');

    // Check Background steps
    const backgroundStep1 = background.steps[0];
    assert.strictEqual(backgroundStep1.name, 'Given I have a test database connection');

    const backgroundStep2 = background.steps[1];
    assert.strictEqual(backgroundStep2.name, 'And I have a test user account created');

    const backgroundStep3 = background.steps[2];
    assert.strictEqual(backgroundStep3.name, 'And I am logged into the application');

    const backgroundStep4 = background.steps[3];
    assert.strictEqual(backgroundStep4.name, 'And I have the necessary permissions');

    // Check first scenario (Successful user login)
    const firstScenario = result.test_cases[0];
    assert.strictEqual(firstScenario.type, 'scenario');
    assert.strictEqual(firstScenario.name, 'Successful user login');
    assert.ok(Array.isArray(firstScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(firstScenario.tags.length, 2, 'Scenario should have 2 tags');
    assert.strictEqual(firstScenario.tags[0], '@positive');
    assert.strictEqual(firstScenario.tags[1], '@login');

    // Check first scenario steps
    assert.ok(Array.isArray(firstScenario.steps), 'Scenario should have steps');
    assert.strictEqual(firstScenario.steps.length, 5, 'Should have 5 steps');

    // Check first scenario step details
    const firstStep = firstScenario.steps[0];
    assert.strictEqual(firstStep.name, 'When I enter valid username "testuser"');

    const secondStep = firstScenario.steps[1];
    assert.strictEqual(secondStep.name, 'And I enter valid password "testpass123"');

    const thirdStep = firstScenario.steps[2];
    assert.strictEqual(thirdStep.name, 'And I click the login button');

    const fourthStep = firstScenario.steps[3];
    assert.strictEqual(fourthStep.name, 'Then I should see the dashboard');

    const fifthStep = firstScenario.steps[4];
    assert.strictEqual(fifthStep.name, 'And I should see my user profile information');

    // Check second scenario (Update user profile)
    const secondScenario = result.test_cases[1];
    assert.strictEqual(secondScenario.type, 'scenario');
    assert.strictEqual(secondScenario.name, 'Update user profile');
    assert.ok(Array.isArray(secondScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(secondScenario.tags.length, 2, 'Scenario should have 2 tags');
    assert.strictEqual(secondScenario.tags[0], '@positive');
    assert.strictEqual(secondScenario.tags[1], '@profile');

    // Check second scenario steps
    assert.ok(Array.isArray(secondScenario.steps), 'Scenario should have steps');
    assert.strictEqual(secondScenario.steps.length, 5, 'Second scenario should have 5 steps');

    // Check second scenario step details
    const secondScenarioStep1 = secondScenario.steps[0];
    assert.strictEqual(secondScenarioStep1.name, 'When I navigate to the profile settings');

    const secondScenarioStep2 = secondScenario.steps[1];
    assert.strictEqual(secondScenarioStep2.name, 'And I update my display name to "Updated User"');

    const secondScenarioStep3 = secondScenario.steps[2];
    assert.strictEqual(secondScenarioStep3.name, 'And I save the changes');

    const secondScenarioStep4 = secondScenario.steps[3];
    assert.strictEqual(secondScenarioStep4.name, 'Then I should see a success message');

    const secondScenarioStep5 = secondScenario.steps[4];
    assert.strictEqual(secondScenarioStep5.name, 'And my display name should be updated to "Updated User"');
  });
});
