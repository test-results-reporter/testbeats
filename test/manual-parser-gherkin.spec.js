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
    assert.strictEqual(result.type, 'GherkinDocument');
    assert.ok(result.feature, 'Feature should exist');
    assert.strictEqual(result.feature.type, 'Feature');
    assert.strictEqual(result.feature.name, 'Basic Calculator Operations');
    assert.strictEqual(result.feature.keyword, 'Feature');

    // Check feature tags
    assert.ok(Array.isArray(result.feature.tags), 'Feature tags should be an array');
    assert.strictEqual(result.feature.tags.length, 2);
    assert.strictEqual(result.feature.tags[0].name, '@smoke');
    assert.strictEqual(result.feature.tags[1].name, '@regression');

    // Check feature description
    assert.ok(result.feature.description, 'Feature should have description');
    assert.ok(result.feature.description.includes('As a user'), 'Description should contain expected text');

    // Check scenarios
    assert.ok(Array.isArray(result.feature.children), 'Feature should have children');
    assert.strictEqual(result.feature.children.length, 2, 'Should have 2 scenarios');

    // Check first scenario
    const firstScenario = result.feature.children[0];
    assert.strictEqual(firstScenario.type, 'Scenario');
    assert.strictEqual(firstScenario.name, 'Addition of two numbers');
    assert.ok(Array.isArray(firstScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(firstScenario.tags.length, 2);
    assert.strictEqual(firstScenario.tags[0].name, '@positive');
    assert.strictEqual(firstScenario.tags[1].name, '@math');

    // Check steps
    assert.ok(Array.isArray(firstScenario.steps), 'Scenario should have steps');
    assert.strictEqual(firstScenario.steps.length, 4, 'Should have 4 steps');

    // Check first step
    const firstStep = firstScenario.steps[0];
    assert.strictEqual(firstStep.keyword, 'Given');
    assert.strictEqual(firstStep.text, 'I have number 5 in calculator');

    // Check 'And' step inherits previous keyword
    const secondStep = firstScenario.steps[1];
    assert.strictEqual(secondStep.keyword, 'Given');
    assert.strictEqual(secondStep.text, 'I have number 3 in calculator');

    // Check 'When' step
    const thirdStep = firstScenario.steps[2];
    assert.strictEqual(thirdStep.keyword, 'When');
    assert.strictEqual(thirdStep.text, 'I add the numbers');

    // Check 'Then' step
    const fourthStep = firstScenario.steps[3];
    assert.strictEqual(fourthStep.keyword, 'Then');
    assert.strictEqual(fourthStep.text, 'I should see result 8');
  });

  it('should parse a complex feature file with Background correctly', () => {
    // Arrange
    const filePath = './test/data/gherkin/complex.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'GherkinDocument');
    assert.ok(result.feature, 'Feature should exist');
    assert.strictEqual(result.feature.type, 'Feature');
    assert.strictEqual(result.feature.name, 'User Management System');
    assert.strictEqual(result.feature.keyword, 'Feature');

    // Check feature tags
    assert.ok(Array.isArray(result.feature.tags), 'Feature tags should be an array');
    assert.strictEqual(result.feature.tags.length, 2);
    assert.strictEqual(result.feature.tags[0].name, '@e2e');
    assert.strictEqual(result.feature.tags[1].name, '@api');

    // Check feature description
    assert.ok(result.feature.description, 'Feature should have description');
    assert.ok(result.feature.description.includes('In order to manage users effectively'), 'Description should contain expected text');

    // Check scenarios
    assert.ok(Array.isArray(result.feature.children), 'Feature should have children');
    assert.strictEqual(result.feature.children.length, 4, 'Should have 4 scenarios');

    // Check first scenario (Create)
    const createScenario = result.feature.children[0];
    assert.strictEqual(createScenario.type, 'Scenario');
    assert.strictEqual(createScenario.name, 'Create a new user');
    assert.ok(Array.isArray(createScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(createScenario.tags.length, 2);
    assert.strictEqual(createScenario.tags[0].name, '@create');
    assert.strictEqual(createScenario.tags[1].name, '@positive');

    // Check create scenario steps
    assert.ok(Array.isArray(createScenario.steps), 'Scenario should have steps');
    assert.strictEqual(createScenario.steps.length, 5, 'Should have 5 steps');

    // Check 'But' step in read scenario
    const readScenario = result.feature.children[1];
    assert.strictEqual(readScenario.name, 'Retrieve user information');
    assert.ok(Array.isArray(readScenario.steps), 'Read scenario should have steps');

    // Find the 'But' step
    const butStep = readScenario.steps.find(step => step.text.includes('should not see the user\'s password'));
    assert.ok(butStep, 'Should have a But step');
    assert.strictEqual(butStep.keyword, 'Then', 'But step should inherit Then keyword');
    assert.strictEqual(butStep.text, 'I should not see the user\'s password');

    // Check update scenario
    const updateScenario = result.feature.children[2];
    assert.strictEqual(updateScenario.name, 'Update user information');
    assert.ok(Array.isArray(updateScenario.steps), 'Update scenario should have steps');

    // Check delete scenario
    const deleteScenario = result.feature.children[3];
    assert.strictEqual(deleteScenario.name, 'Delete non-existent user');
    assert.ok(Array.isArray(deleteScenario.tags), 'Delete scenario should have tags');
    assert.strictEqual(deleteScenario.tags.length, 2);
    assert.strictEqual(deleteScenario.tags[0].name, '@delete');
    assert.strictEqual(deleteScenario.tags[1].name, '@negative');
  });

  it('should parse a feature file without tags correctly', () => {
    // Arrange
    const filePath = './test/data/gherkin/no-tags.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'GherkinDocument');
    assert.ok(result.feature, 'Feature should exist');
    assert.strictEqual(result.feature.type, 'Feature');
    assert.strictEqual(result.feature.name, 'No Tags');
    assert.strictEqual(result.feature.keyword, 'Feature');

    // Check feature tags - should be empty array
    assert.ok(Array.isArray(result.feature.tags), 'Feature tags should be an array');
    assert.strictEqual(result.feature.tags.length, 0, 'Feature should have no tags');

    // Check feature description
    assert.ok(result.feature.description, 'Feature should have description');
    assert.strictEqual(result.feature.description.trim(), 'This is a feature description');

    // Check scenarios
    assert.ok(Array.isArray(result.feature.children), 'Feature should have children');
    assert.strictEqual(result.feature.children.length, 1, 'Should have 1 scenario');

    // Check scenario
    const scenario = result.feature.children[0];
    assert.strictEqual(scenario.type, 'Scenario');
    assert.strictEqual(scenario.name, 'No Tags Scenario');

    // Check scenario tags - should be empty array
    assert.ok(Array.isArray(scenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(scenario.tags.length, 0, 'Scenario should have no tags');

    // Check steps
    assert.ok(Array.isArray(scenario.steps), 'Scenario should have steps');
    assert.strictEqual(scenario.steps.length, 3, 'Should have 3 steps');

    // Check first step
    const firstStep = scenario.steps[0];
    assert.strictEqual(firstStep.keyword, 'Given');
    assert.strictEqual(firstStep.text, 'I have a simple step');

    // Check second step
    const secondStep = scenario.steps[1];
    assert.strictEqual(secondStep.keyword, 'When');
    assert.strictEqual(secondStep.text, 'I do something simple');

    // Check third step
    const thirdStep = scenario.steps[2];
    assert.strictEqual(thirdStep.keyword, 'Then');
    assert.strictEqual(thirdStep.text, 'I see simple results');
  });

  it('should parse a feature file with scenarios without steps correctly', () => {
    // Arrange
    const filePath = './test/data/gherkin/no-steps.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'GherkinDocument');
    assert.ok(result.feature, 'Feature should exist');
    assert.strictEqual(result.feature.type, 'Feature');
    assert.strictEqual(result.feature.name, 'No Steps');
    assert.strictEqual(result.feature.keyword, 'Feature');

    // Check feature tags
    assert.ok(Array.isArray(result.feature.tags), 'Feature tags should be an array');
    assert.strictEqual(result.feature.tags.length, 1, 'Feature should have 1 tag');
    assert.strictEqual(result.feature.tags[0].name, '@simple');

    // Check feature description
    assert.ok(result.feature.description, 'Feature should have description');
    assert.strictEqual(result.feature.description.trim(), 'This is a simple feature description');

    // Check scenarios
    assert.ok(Array.isArray(result.feature.children), 'Feature should have children');
    assert.strictEqual(result.feature.children.length, 10, 'Should have 10 scenarios');

    // Check first scenario
    const firstScenario = result.feature.children[0];
    assert.strictEqual(firstScenario.type, 'Scenario');
    assert.strictEqual(firstScenario.name, 'No Steps Scenario One');

    // Check scenario tags - should be empty array
    assert.ok(Array.isArray(firstScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(firstScenario.tags.length, 0, 'Scenario should have no tags');

    // Check steps - should be empty array
    assert.ok(Array.isArray(firstScenario.steps), 'Scenario should have steps array');
    assert.strictEqual(firstScenario.steps.length, 0, 'Scenario should have no steps');

    // Check last scenario
    const lastScenario = result.feature.children[9];
    assert.strictEqual(lastScenario.type, 'Scenario');
    assert.strictEqual(lastScenario.name, 'No Steps Scenario Ten');

    // Check last scenario has no steps
    assert.ok(Array.isArray(lastScenario.steps), 'Last scenario should have steps array');
    assert.strictEqual(lastScenario.steps.length, 0, 'Last scenario should have no steps');

    // Verify all scenarios have no steps
    result.feature.children.forEach((scenario, index) => {
      assert.strictEqual(scenario.type, 'Scenario', `Scenario ${index + 1} should be of type Scenario`);
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
    assert.strictEqual(result.type, 'GherkinDocument');
    assert.ok(result.feature, 'Feature should exist');
    assert.strictEqual(result.feature.type, 'Feature');
    assert.strictEqual(result.feature.name, 'Comment Examples in Gherkin');
    assert.strictEqual(result.feature.keyword, 'Feature');

    // Check feature tags
    assert.ok(Array.isArray(result.feature.tags), 'Feature tags should be an array');
    assert.strictEqual(result.feature.tags.length, 3, 'Feature should have 3 tags');
    assert.strictEqual(result.feature.tags[0].name, '@comments');
    assert.strictEqual(result.feature.tags[1].name, '@example');
    assert.strictEqual(result.feature.tags[2].name, '@documentation');

    // Check feature description
    assert.ok(result.feature.description, 'Feature should have description');
    assert.ok(result.feature.description.includes('As a developer'), 'Description should contain expected text');
    assert.ok(result.feature.description.includes('I want to understand how to use comments in Gherkin'), 'Description should contain expected text');

    // Check scenarios
    assert.ok(Array.isArray(result.feature.children), 'Feature should have children');
    assert.strictEqual(result.feature.children.length, 3, 'Should have 3 children (1 Background + 2 Scenarios)');

    // Check Background
    const background = result.feature.children[0];
    assert.strictEqual(background.type, 'Background');
    assert.ok(Array.isArray(background.steps), 'Background should have steps');
    assert.strictEqual(background.steps.length, 2, 'Background should have 2 steps');

    // Check Background steps
    const backgroundStep1 = background.steps[0];
    assert.strictEqual(backgroundStep1.keyword, 'Given');
    assert.strictEqual(backgroundStep1.text, 'I have a test environment set up');

    const backgroundStep2 = background.steps[1];
    assert.strictEqual(backgroundStep2.keyword, 'And');
    assert.strictEqual(backgroundStep2.text, 'I am ready to run tests');

    // Check first scenario (Basic comment usage)
    const firstScenario = result.feature.children[1];
    assert.strictEqual(firstScenario.type, 'Scenario');
    assert.strictEqual(firstScenario.name, 'Basic comment usage');
    assert.ok(Array.isArray(firstScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(firstScenario.tags.length, 2, 'Scenario should have 2 tags');
    assert.strictEqual(firstScenario.tags[0].name, '@positive');
    assert.strictEqual(firstScenario.tags[1].name, '@basic');

    // Check first scenario steps
    assert.ok(Array.isArray(firstScenario.steps), 'Scenario should have steps');
    assert.strictEqual(firstScenario.steps.length, 4, 'Should have 4 steps');

    // Check first scenario step details
    const firstStep = firstScenario.steps[0];
    assert.strictEqual(firstStep.keyword, 'Given');
    assert.strictEqual(firstStep.text, 'I have a feature file open');

    const secondStep = firstScenario.steps[1];
    assert.strictEqual(secondStep.keyword, 'When');
    assert.strictEqual(secondStep.text, 'I add comments to explain the steps');

    const thirdStep = firstScenario.steps[2];
    assert.strictEqual(thirdStep.keyword, 'Then');
    assert.strictEqual(thirdStep.text, 'I should see clear documentation');

    const fourthStep = firstScenario.steps[3];
    assert.strictEqual(fourthStep.keyword, 'And');
    assert.strictEqual(fourthStep.text, 'the code should be more maintainable');

    // Check second scenario (Advanced comment patterns)
    const secondScenario = result.feature.children[2];
    assert.strictEqual(secondScenario.type, 'Scenario');
    assert.strictEqual(secondScenario.name, 'Advanced comment patterns');
    assert.ok(Array.isArray(secondScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(secondScenario.tags.length, 2, 'Scenario should have 2 tags');
    assert.strictEqual(secondScenario.tags[0].name, '@negative');
    assert.strictEqual(secondScenario.tags[1].name, '@advanced');

    // Check second scenario steps
    assert.ok(Array.isArray(secondScenario.steps), 'Scenario should have steps');
    assert.strictEqual(secondScenario.steps.length, 3, 'Should have 3 steps');

    // Check second scenario step details
    const secondScenarioStep1 = secondScenario.steps[0];
    assert.strictEqual(secondScenarioStep1.keyword, 'Given');
    assert.strictEqual(secondScenarioStep1.text, 'I have a complex test flow');

    const secondScenarioStep2 = secondScenario.steps[1];
    assert.strictEqual(secondScenarioStep2.keyword, 'When');
    assert.strictEqual(secondScenarioStep2.text, 'I execute the test');

    const secondScenarioStep3 = secondScenario.steps[2];
    assert.strictEqual(secondScenarioStep3.keyword, 'Then');
    assert.strictEqual(secondScenarioStep3.text, 'I should see the expected results');
  });

  it('should parse a feature file with background correctly', () => {
    // Arrange
    const filePath = './test/data/gherkin/background.feature';

    // Act
    const result = parser.parse(filePath);

    // Assert
    assert.strictEqual(result.type, 'GherkinDocument');
    assert.ok(result.feature, 'Feature should exist');
    assert.strictEqual(result.feature.type, 'Feature');
    assert.strictEqual(result.feature.name, 'Background Section Examples');
    assert.strictEqual(result.feature.keyword, 'Feature');

    // Check feature tags
    assert.ok(Array.isArray(result.feature.tags), 'Feature tags should be an array');
    assert.strictEqual(result.feature.tags.length, 3, 'Feature should have 3 tags');
    assert.strictEqual(result.feature.tags[0].name, '@background');
    assert.strictEqual(result.feature.tags[1].name, '@example');
    assert.strictEqual(result.feature.tags[2].name, '@setup');

    // Check feature description
    assert.ok(result.feature.description, 'Feature should have description');
    assert.ok(result.feature.description.includes('As a test automation engineer'), 'Description should contain expected text');
    assert.ok(result.feature.description.includes('I want to understand how Background sections work in Gherkin'), 'Description should contain expected text');

    // Check scenarios
    assert.ok(Array.isArray(result.feature.children), 'Feature should have children');
    assert.strictEqual(result.feature.children.length, 3, 'Should have 3 children (1 Background + 2 Scenarios)');

    // Check Background
    const background = result.feature.children[0];
    assert.strictEqual(background.type, 'Background');
    assert.ok(Array.isArray(background.steps), 'Background should have steps');
    assert.strictEqual(background.steps.length, 4, 'Background should have 4 steps');

    // Check Background steps
    const backgroundStep1 = background.steps[0];
    assert.strictEqual(backgroundStep1.keyword, 'Given');
    assert.strictEqual(backgroundStep1.text, 'I have a test database connection');

    const backgroundStep2 = background.steps[1];
    assert.strictEqual(backgroundStep2.keyword, 'And');
    assert.strictEqual(backgroundStep2.text, 'I have a test user account created');

    const backgroundStep3 = background.steps[2];
    assert.strictEqual(backgroundStep3.keyword, 'And');
    assert.strictEqual(backgroundStep3.text, 'I am logged into the application');

    const backgroundStep4 = background.steps[3];
    assert.strictEqual(backgroundStep4.keyword, 'And');
    assert.strictEqual(backgroundStep4.text, 'I have the necessary permissions');

    // Check first scenario (Successful user login)
    const firstScenario = result.feature.children[1];
    assert.strictEqual(firstScenario.type, 'Scenario');
    assert.strictEqual(firstScenario.name, 'Successful user login');
    assert.ok(Array.isArray(firstScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(firstScenario.tags.length, 2, 'Scenario should have 2 tags');
    assert.strictEqual(firstScenario.tags[0].name, '@positive');
    assert.strictEqual(firstScenario.tags[1].name, '@login');

    // Check first scenario steps
    assert.ok(Array.isArray(firstScenario.steps), 'Scenario should have steps');
    assert.strictEqual(firstScenario.steps.length, 5, 'Should have 5 steps');

    // Check first scenario step details
    const firstStep = firstScenario.steps[0];
    assert.strictEqual(firstStep.keyword, 'When');
    assert.strictEqual(firstStep.text, 'I enter valid username "testuser"');

    const secondStep = firstScenario.steps[1];
    assert.strictEqual(secondStep.keyword, 'And');
    assert.strictEqual(secondStep.text, 'I enter valid password "testpass123"');

    const thirdStep = firstScenario.steps[2];
    assert.strictEqual(thirdStep.keyword, 'And');
    assert.strictEqual(thirdStep.text, 'I click the login button');

    const fourthStep = firstScenario.steps[3];
    assert.strictEqual(fourthStep.keyword, 'Then');
    assert.strictEqual(fourthStep.text, 'I should see the dashboard');

    const fifthStep = firstScenario.steps[4];
    assert.strictEqual(fifthStep.keyword, 'And');
    assert.strictEqual(fifthStep.text, 'I should see my user profile information');

    // Check second scenario (Update user profile)
    const secondScenario = result.feature.children[2];
    assert.strictEqual(secondScenario.type, 'Scenario');
    assert.strictEqual(secondScenario.name, 'Update user profile');
    assert.ok(Array.isArray(secondScenario.tags), 'Scenario tags should be an array');
    assert.strictEqual(secondScenario.tags.length, 2, 'Scenario should have 2 tags');
    assert.strictEqual(secondScenario.tags[0].name, '@positive');
    assert.strictEqual(secondScenario.tags[1].name, '@profile');

    // Check second scenario steps
    assert.ok(Array.isArray(secondScenario.steps), 'Scenario should have steps');
    assert.strictEqual(secondScenario.steps.length, 4, 'Should have 4 steps');

    // Check second scenario step details
    const secondScenarioStep1 = secondScenario.steps[0];
    assert.strictEqual(secondScenarioStep1.keyword, 'When');
    assert.strictEqual(secondScenarioStep1.text, 'I navigate to the profile settings');

    const secondScenarioStep2 = secondScenario.steps[1];
    assert.strictEqual(secondScenarioStep2.keyword, 'And');
    assert.strictEqual(secondScenarioStep2.text, 'I update my display name to "Updated User"');

    const secondScenarioStep3 = secondScenario.steps[2];
    assert.strictEqual(secondScenarioStep3.keyword, 'And');
    assert.strictEqual(secondScenarioStep3.text, 'I save the changes');

    const secondScenarioStep4 = secondScenario.steps[3];
    assert.strictEqual(secondScenarioStep4.keyword, 'Then');
    assert.strictEqual(secondScenarioStep4.text, 'I should see a success message');
  });
});
