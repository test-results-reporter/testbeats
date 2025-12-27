const { GherkinParser } = require('../src/manual/parsers/gherkin');
const assert = require('assert');

function createMockFs(content) {
  return {
    readFileSync: (_) => {
      return content;
    }
  };
}


describe('Gherkin Parser', () => {

  it('should parse a basic feature with no scenarios', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Basic Calculator Operations
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/basic.feature');

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'Basic Calculator Operations');
    assert.strictEqual(result.test_cases.length, 0);
  });


  it('should parse a basic feature with one scenario', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Basic Calculator Operations

      Scenario: Addition of two numbers
        Given I have number 5 in calculator
        And I have number 3 in calculator
        When I add the numbers
        Then I should see result 8
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/basic.feature');

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'Basic Calculator Operations');
    assert.strictEqual(result.test_cases.length, 1);
    assert.strictEqual(result.test_cases[0].type, 'scenario');
    assert.strictEqual(result.test_cases[0].name, 'Addition of two numbers');
  });


  it('should parse a feature with multiple scenarios', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: User Authentication

      Scenario: Successful login
        Given I am on the login page
        When I enter valid credentials
        Then I should be logged in

      Scenario: Failed login with invalid password
        Given I am on the login page
        When I enter invalid password
        Then I should see an error message
        And I should remain on the login page

      Scenario: Password reset
        Given I am on the login page
        When I click forgot password
        And I enter my email
        Then I should receive a reset link
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/auth.feature');

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'User Authentication');
    assert.strictEqual(result.test_cases.length, 3);

    assert.strictEqual(result.test_cases[0].name, 'Successful login');
    assert.strictEqual(result.test_cases[0].steps.length, 3);

    assert.strictEqual(result.test_cases[1].name, 'Failed login with invalid password');
    assert.strictEqual(result.test_cases[1].steps.length, 4);

    assert.strictEqual(result.test_cases[2].name, 'Password reset');
    assert.strictEqual(result.test_cases[2].steps.length, 4);
  });


  it('should parse feature and scenario tags correctly', () => {
    // Arrange
    const mockFs = createMockFs(`
      @smoke @regression @critical
      Feature: Payment Processing

      @positive @payment
      Scenario: Successful credit card payment
        Given I have items in my cart
        When I pay with credit card
        Then payment should be processed

      @negative @validation
      Scenario: Payment with expired card
        Given I have items in my cart
        When I pay with expired credit card
        Then payment should be rejected
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/payment.feature');

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'Payment Processing');

    assert.ok(Array.isArray(result.tags));
    assert.strictEqual(result.tags.length, 3);
    assert.deepStrictEqual(result.tags, ['@smoke', '@regression', '@critical']);

    assert.strictEqual(result.test_cases[0].tags.length, 2);
    assert.deepStrictEqual(result.test_cases[0].tags, ['@positive', '@payment']);

    assert.strictEqual(result.test_cases[1].tags.length, 2);
    assert.deepStrictEqual(result.test_cases[1].tags, ['@negative', '@validation']);
  });


  it('should parse background section into before_each', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Shopping Cart

      Background:
        Given I am logged in as a user
        And I have an empty cart
        And the store has inventory

      Scenario: Add item to cart
        When I add a product to cart
        Then cart should contain 1 item

      Scenario: Remove item from cart
        Given I have 1 item in cart
        When I remove the item
        Then cart should be empty
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/cart.feature');

    // Assert
    assert.strictEqual(result.name, 'Shopping Cart');
    assert.ok(Array.isArray(result.before_each));
    assert.strictEqual(result.before_each.length, 1);

    const background = result.before_each[0];
    assert.strictEqual(background.type, 'background');
    assert.ok(Array.isArray(background.steps));
    assert.strictEqual(background.steps.length, 3);
    assert.strictEqual(background.steps[0].name, 'Given I am logged in as a user');
    assert.strictEqual(background.steps[1].name, 'And I have an empty cart');
    assert.strictEqual(background.steps[2].name, 'And the store has inventory');

    assert.strictEqual(result.test_cases.length, 2);
  });


  it('should parse all step keywords correctly', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Step Keywords

      Scenario: Test all keywords
        Given I have a precondition
        And I have another precondition
        When I perform an action
        And I perform another action
        Then I should see a result
        And I should see another result
        But I should not see something else
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/keywords.feature');

    // Assert
    assert.strictEqual(result.test_cases.length, 1);
    const scenario = result.test_cases[0];
    assert.strictEqual(scenario.steps.length, 7);

    assert.strictEqual(scenario.steps[0].name, 'Given I have a precondition');
    assert.strictEqual(scenario.steps[1].name, 'And I have another precondition');
    assert.strictEqual(scenario.steps[2].name, 'When I perform an action');
    assert.strictEqual(scenario.steps[3].name, 'And I perform another action');
    assert.strictEqual(scenario.steps[4].name, 'Then I should see a result');
    assert.strictEqual(scenario.steps[5].name, 'And I should see another result');
    assert.strictEqual(scenario.steps[6].name, 'But I should not see something else');
  });


  it('should parse multi-line feature description', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Advanced Search
        This feature allows users to search
        across multiple criteria and filter results
        based on various parameters.

      Scenario: Basic search
        Given I am on search page
        When I enter search term
        Then I see results
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/search.feature');

    // Assert
    assert.strictEqual(result.name, 'Advanced Search');
    assert.strictEqual(result.test_cases.length, 1);
    assert.strictEqual(result.test_cases[0].name, 'Basic search');
    assert.strictEqual(result.test_cases[0].steps.length, 3);
  });


  it('should handle empty feature with no scenarios', () => {
    // Arrange
    const mockFs = createMockFs(`
      @wip
      Feature: Work in Progress Feature
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/empty.feature');

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, 'Work in Progress Feature');
    assert.deepStrictEqual(result.tags, ['@wip']);
    assert.strictEqual(result.test_cases.length, 0);
    assert.strictEqual(result.before_each.length, 0);
  });


  it('should handle scenarios without steps', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Placeholder Tests

      Scenario: Test One

      Scenario: Test Two

      Scenario: Test Three
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/placeholder.feature');

    // Assert
    assert.strictEqual(result.name, 'Placeholder Tests');
    assert.strictEqual(result.test_cases.length, 3);

    result.test_cases.forEach((testCase, index) => {
      assert.strictEqual(testCase.type, 'scenario');
      assert.ok(Array.isArray(testCase.steps));
      assert.strictEqual(testCase.steps.length, 0);
    });
  });


  it('should handle feature without tags', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: No Tags Feature

      Scenario: No Tags Scenario
        Given I have a step
        When I do something
        Then I see result
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/notags.feature');

    // Assert
    assert.strictEqual(result.name, 'No Tags Feature');
    assert.ok(Array.isArray(result.tags));
    assert.strictEqual(result.tags.length, 0);

    assert.strictEqual(result.test_cases[0].name, 'No Tags Scenario');
    assert.ok(Array.isArray(result.test_cases[0].tags));
    assert.strictEqual(result.test_cases[0].tags.length, 0);
  });


  it('should handle multiple backgrounds correctly', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Multiple Backgrounds

      Background:
        Given first background step
        And second background step

      Scenario: First scenario
        When I do something
        Then I see result

      Background:
        Given third background step

      Scenario: Second scenario
        When I do another thing
        Then I see another result
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/multiback.feature');

    // Assert
    assert.strictEqual(result.name, 'Multiple Backgrounds');
    assert.ok(Array.isArray(result.before_each));
    assert.strictEqual(result.test_cases.length, 2);
  });


  it('should handle complex tag patterns', () => {
    // Arrange
    const mockFs = createMockFs(`
      @tag1 @tag2 @tag3 @tag_with_underscore @tagWithCamelCase @TAG_UPPER
      Feature: Complex Tags

      @scenarioTag @another_tag @tag123
      Scenario: Tagged scenario
        Given I have a step
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/complextags.feature');

    // Assert
    assert.strictEqual(result.tags.length, 6);
    assert.ok(result.tags.includes('@tag1'));
    assert.ok(result.tags.includes('@tag2'));
    assert.ok(result.tags.includes('@tag3'));
    assert.ok(result.tags.includes('@tag_with_underscore'));
    assert.ok(result.tags.includes('@tagWithCamelCase'));
    assert.ok(result.tags.includes('@TAG_UPPER'));

    assert.strictEqual(result.test_cases[0].tags.length, 3);
    assert.ok(result.test_cases[0].tags.includes('@scenarioTag'));
    assert.ok(result.test_cases[0].tags.includes('@another_tag'));
    assert.ok(result.test_cases[0].tags.includes('@tag123'));
  });


  it('should generate hash for test cases and test suite', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Hash Generation

      Scenario: Test scenario
        Given I have a step
        When I do something
        Then I see result
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/hash.feature');

    // Assert
    assert.ok(result.hash, 'Test suite should have hash');
    assert.strictEqual(typeof result.hash, 'string');
    assert.ok(result.hash.length > 0);

    assert.strictEqual(result.test_cases.length, 1);
    assert.ok(result.test_cases[0].hash, 'Test case should have hash');
    assert.strictEqual(typeof result.test_cases[0].hash, 'string');
    assert.ok(result.test_cases[0].hash.length > 0);
  });


  it('should validate returned structure matches expected schema', () => {
    // Arrange
    const mockFs = createMockFs(`
      @feature-tag
      Feature: Structure Validation

      Background:
        Given background step

      @scenario-tag
      Scenario: Test scenario
        Given I have a step
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/structure.feature');

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.ok(typeof result.name === 'string');
    assert.ok(Array.isArray(result.tags));
    assert.ok(Array.isArray(result.before_each));
    assert.ok(Array.isArray(result.test_cases));
    assert.ok(typeof result.hash === 'string');

    const testCase = result.test_cases[0];
    assert.strictEqual(testCase.type, 'scenario');
    assert.ok(typeof testCase.name === 'string');
    assert.ok(Array.isArray(testCase.tags));
    assert.ok(Array.isArray(testCase.steps));
    assert.ok(typeof testCase.hash === 'string');

    const background = result.before_each[0];
    assert.strictEqual(background.type, 'background');
    assert.ok(Array.isArray(background.steps));
  });


  it('should handle whitespace and blank lines correctly', () => {
    // Arrange
    const mockFs = createMockFs(`

      @tag1    @tag2

      Feature:   Whitespace Handling


      Scenario:    Test Scenario
        Given   I have a step with spaces

        When    I do something

        Then  I see result

    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/whitespace.feature');

    // Assert
    assert.strictEqual(result.name, 'Whitespace Handling');
    assert.strictEqual(result.tags.length, 2);
    assert.strictEqual(result.test_cases[0].name, 'Test Scenario');
    assert.strictEqual(result.test_cases[0].steps.length, 3);
    assert.strictEqual(result.test_cases[0].steps[0].name, 'Given   I have a step with spaces');
  });


  it('should throw error when file reading fails', () => {
    // Arrange
    const mockFs = {
      readFileSync: () => {
        throw new Error('File not found');
      }
    };
    const parser = new GherkinParser(mockFs);

    // Act & Assert
    assert.throws(
      () => parser.parse('./nonexistent.feature'),
      /Failed to parse Gherkin file/
    );
  });


  it('should handle content without Feature keyword', () => {
    // Arrange
    const mockFs = createMockFs(`
      Scenario: Orphan Scenario
        Given I have a step
        When I do something
        Then I see result
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/nofeature.feature');

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, '');
    assert.strictEqual(result.test_cases.length, 1);
    assert.strictEqual(result.test_cases[0].name, 'Orphan Scenario');
    assert.strictEqual(result.test_cases[0].steps.length, 3);
  });


  // Real-Life Scenario Tests

  it('should parse feature with inline comments throughout', () => {
    // Arrange
    const mockFs = createMockFs(`
      # Top-level comment explaining the feature file
      # This is common in production codebases
      @api @integration
      Feature: User Login API
        # Comments can appear after feature declaration
        As a user
        I want to login securely

      # Comment before background
      Background:
        Given the API is running
        # Comment between background steps
        And the database is accessible

      # Comment before scenario
      @smoke
      Scenario: Successful login
        Given I have valid credentials
        # This comment explains why we check the token
        When I submit login request
        Then I receive an authentication token
        # Final comment in scenario
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/comments.feature');

    // Assert
    assert.strictEqual(result.name, 'User Login API');
    assert.strictEqual(result.before_each.length, 1);
    assert.strictEqual(result.before_each[0].steps.length, 2);
    assert.strictEqual(result.test_cases.length, 1);
    assert.strictEqual(result.test_cases[0].name, 'Successful login');
    assert.strictEqual(result.test_cases[0].steps.length, 3);
  });


  it('should handle mixed comments at various positions', () => {
    // Arrange
    const mockFs = createMockFs(`
      # File header comment
      # Author: Test Team
      # Date: 2024-01-01

      @feature-tag
      # Comment after tag line
      Feature: Mixed Comments Test

      # Multiple comments
      # between feature and scenario
      # are common in documentation

      Scenario: First test
        Given step one
        When step two
        Then step three

      # Comment between scenarios
      # explaining the next test case

      Scenario: Second test
        Given another step
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/mixed-comments.feature');

    // Assert
    assert.strictEqual(result.name, 'Mixed Comments Test');
    assert.strictEqual(result.test_cases.length, 2);
    assert.strictEqual(result.test_cases[0].name, 'First test');
    assert.strictEqual(result.test_cases[1].name, 'Second test');
  });


  it('should handle comment-only lines between steps', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Logical Step Grouping

      Scenario: Multi-phase test
        # Setup phase
        Given I am logged in
        And I have permissions

        # Execution phase
        # This is where the main action happens
        When I perform the operation
        And I wait for completion

        # Verification phase
        Then I should see success
        And data should be updated
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/step-comments.feature');

    // Assert
    assert.strictEqual(result.test_cases[0].steps.length, 6);
    assert.strictEqual(result.test_cases[0].steps[0].name, 'Given I am logged in');
    assert.strictEqual(result.test_cases[0].steps[2].name, 'When I perform the operation');
    assert.strictEqual(result.test_cases[0].steps[4].name, 'Then I should see success');
  });


  it('should parse steps with quoted parameters', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: API Testing with Parameters

      Scenario: User registration
        Given user "John Doe" wants to register
        And email is "john.doe@example.com"
        When I submit with password "Secure@123"
        Then response contains 'User created successfully'
        And status code is "201"
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/quoted-params.feature');

    // Assert
    assert.strictEqual(result.test_cases[0].steps.length, 5);
    assert.strictEqual(result.test_cases[0].steps[0].name, 'Given user "John Doe" wants to register');
    assert.strictEqual(result.test_cases[0].steps[1].name, 'And email is "john.doe@example.com"');
    assert.strictEqual(result.test_cases[0].steps[2].name, 'When I submit with password "Secure@123"');
    assert.strictEqual(result.test_cases[0].steps[3].name, "Then response contains 'User created successfully'");
  });


  it('should handle steps with special characters', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Special Characters Handling

      Scenario: Price calculation
        Given product price is $99.99
        And discount is 10%
        When I calculate total (including tax)
        Then amount should be $89.99 + 8.5% tax
        And receipt shows: *PAID* [COMPLETE]
        But not (PENDING) or {CANCELLED}
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/special-chars.feature');

    // Assert
    assert.strictEqual(result.test_cases[0].steps.length, 6);
    assert.strictEqual(result.test_cases[0].steps[0].name, 'Given product price is $99.99');
    assert.strictEqual(result.test_cases[0].steps[2].name, 'When I calculate total (including tax)');
    assert.strictEqual(result.test_cases[0].steps[4].name, 'And receipt shows: *PAID* [COMPLETE]');
  });


  it('should parse steps with numbers and URLs', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: E-commerce Navigation

      Scenario: Product browsing
        Given I navigate to "https://shop.example.com/products"
        And page loads in less than 2.5 seconds
        When I view category with 150 items
        Then I should see first 20 products
        And pagination shows 8 pages
        And API endpoint is "https://api.example.com/v2/products?limit=20&offset=0"
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/urls-numbers.feature');

    // Assert
    assert.strictEqual(result.test_cases[0].steps.length, 6);
    assert.strictEqual(result.test_cases[0].steps[0].name, 'Given I navigate to "https://shop.example.com/products"');
    assert.strictEqual(result.test_cases[0].steps[2].name, 'When I view category with 150 items');
    assert.ok(result.test_cases[0].steps[5].name.includes('https://api.example.com'));
  });


  it('should handle steps with colons in text', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Time and Error Handling

      Scenario: Schedule meeting
        Given current time is "10:30 AM"
        And meeting duration is "01:45:00"
        When I schedule for "2024-12-27T14:30:00Z"
        Then confirmation shows "Meeting: Team Sync at 2:30 PM"
        But not "Error: Invalid time format"
        And log contains "Status: Scheduled successfully"
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/colons.feature');

    // Assert
    assert.strictEqual(result.test_cases[0].steps.length, 6);
    assert.strictEqual(result.test_cases[0].steps[0].name, 'Given current time is "10:30 AM"');
    assert.strictEqual(result.test_cases[0].steps[3].name, 'Then confirmation shows "Meeting: Team Sync at 2:30 PM"');
    assert.ok(result.test_cases[0].steps[4].name.includes('Error: Invalid time format'));
  });


  it('should parse scenarios with multi-line descriptions', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Enhanced Scenarios

      Scenario: Complex workflow
        This scenario tests the complete user journey
        from registration through checkout process
        including edge cases and error handling

        Given I am a new user
        When I complete registration
        Then I can make purchases
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/scenario-desc.feature');

    // Assert
    assert.strictEqual(result.test_cases.length, 1);
    assert.strictEqual(result.test_cases[0].name, 'Complex workflow');
    assert.strictEqual(result.test_cases[0].steps.length, 3);
  });


  it('should handle inconsistent indentation', () => {
    // Arrange
    const mockFs = createMockFs(`
Feature: Messy Formatting
This happens in real teams

Scenario: Inconsistent spaces
Given I have no indentation
  And I have 2 spaces
    And I have 4 spaces
      When I have 6 spaces
        Then parser should still work
          And handle all variations
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/indent.feature');

    // Assert
    assert.strictEqual(result.name, 'Messy Formatting');
    assert.strictEqual(result.test_cases[0].steps.length, 6);
    assert.strictEqual(result.test_cases[0].steps[0].name, 'Given I have no indentation');
    assert.strictEqual(result.test_cases[0].steps[5].name, 'And handle all variations');
  });


  it('should handle excessive blank lines', () => {
    // Arrange
    const mockFs = createMockFs(`


      @tag1


      Feature: Lots of Blank Lines



      Background:

        Given setup step one


        And setup step two



      @scenario-tag

      Scenario: Test with spaces


        Given I have a step


        When I do something



        Then I see result


    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/blanks.feature');

    // Assert
    assert.strictEqual(result.name, 'Lots of Blank Lines');
    assert.strictEqual(result.before_each.length, 1);
    assert.strictEqual(result.before_each[0].steps.length, 2);
    assert.strictEqual(result.test_cases.length, 1);
    assert.strictEqual(result.test_cases[0].steps.length, 3);
  });


  it('should parse tags on multiple lines', () => {
    // Arrange
    const mockFs = createMockFs(`
      @feature_tag1
      @feature_tag2
      @feature_tag3
      Feature: Multi-line Tags

      @scenario_tag1
      @scenario_tag2
      @scenario_tag3
      Scenario: Tagged scenario
        Given I have a step
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/multiline-tags.feature');

    // Assert - parser now captures all tags from consecutive @ lines
    assert.strictEqual(result.tags.length, 3);
    assert.ok(result.tags.includes('@feature_tag1'));
    assert.ok(result.tags.includes('@feature_tag2'));
    assert.ok(result.tags.includes('@feature_tag3'));

    assert.strictEqual(result.test_cases[0].tags.length, 3);
    assert.ok(result.test_cases[0].tags.includes('@scenario_tag1'));
    assert.ok(result.test_cases[0].tags.includes('@scenario_tag2'));
    assert.ok(result.test_cases[0].tags.includes('@scenario_tag3'));
  });


  it('should handle mixed tag formats', () => {
    // Arrange
    const mockFs = createMockFs(`
      @tag1 @tag2 @tag3
      @tag4
      @tag5 @tag6
      Feature: Mixed Tag Format

      @s1 @s2
      Scenario: First scenario
        Given step one

      @s3
      @s4 @s5
      Scenario: Second scenario
        Given step two
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/mixed-tags.feature');

    // Assert - parser now captures all tags from consecutive @ lines
    assert.strictEqual(result.tags.length, 6);
    assert.ok(result.tags.includes('@tag1'));
    assert.ok(result.tags.includes('@tag2'));
    assert.ok(result.tags.includes('@tag3'));
    assert.ok(result.tags.includes('@tag4'));
    assert.ok(result.tags.includes('@tag5'));
    assert.ok(result.tags.includes('@tag6'));

    assert.strictEqual(result.test_cases[0].tags.length, 2);
    assert.ok(result.test_cases[0].tags.includes('@s1'));
    assert.ok(result.test_cases[0].tags.includes('@s2'));

    assert.strictEqual(result.test_cases[1].tags.length, 3);
    assert.ok(result.test_cases[1].tags.includes('@s3'));
    assert.ok(result.test_cases[1].tags.includes('@s4'));
    assert.ok(result.test_cases[1].tags.includes('@s5'));
  });


  it('should handle very long feature and scenario names', () => {
    // Arrange
    const longFeatureName = 'This is an extremely long feature name that might appear in enterprise environments where business requirements documentation is verbose and contains extensive detail about the feature purpose scope and business value proposition';
    const longScenarioName = 'This is a very detailed scenario name describing exactly what this test does including all the edge cases boundary conditions and expected outcomes in complete sentences with proper grammar';

    const mockFs = createMockFs(`
      Feature: ${longFeatureName}

      Scenario: ${longScenarioName}
        Given I have a step
        When I do something
        Then I see result
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/longnames.feature');

    // Assert
    assert.strictEqual(result.name, longFeatureName);
    assert.strictEqual(result.test_cases[0].name, longScenarioName);
    assert.strictEqual(result.test_cases[0].steps.length, 3);
  });


  it('should handle duplicate scenario names', () => {
    // Arrange
    const mockFs = createMockFs(`
      Feature: Duplicate Scenarios

      Scenario: Test Login
        Given I am on login page
        When I enter valid credentials
        Then I am logged in

      Scenario: Test Login
        Given I am on login page
        When I enter invalid credentials
        Then I see error message

      Scenario: Test Login
        Given I am on login page
        When I leave fields empty
        Then I see validation error
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/duplicates.feature');

    // Assert
    assert.strictEqual(result.test_cases.length, 3);
    assert.strictEqual(result.test_cases[0].name, 'Test Login');
    assert.strictEqual(result.test_cases[1].name, 'Test Login');
    assert.strictEqual(result.test_cases[2].name, 'Test Login');

    assert.notStrictEqual(result.test_cases[0].hash, result.test_cases[1].hash);
    assert.notStrictEqual(result.test_cases[1].hash, result.test_cases[2].hash);
  });


  it('should handle unicode characters and emoji', () => {
    // Arrange
    const mockFs = createMockFs(`
      @🚀 @测试
      Feature: Unicode Support 🌍

      Scenario: Tester avec des accents français
        Given l'utilisateur "François" est connecté
        When je clique sur "Paramètres"
        Then je vois "Succès ✓"

      Scenario: Prueba con caracteres españoles
        Given usuario "José" tiene acceso
        When navego a "Configuración"
        Then veo mensaje "¡Éxito!"

      Scenario: Test with emoji 😀
        Given user "测试用户" logs in
        When action "发送消息 📧" is performed
        Then result is "成功 ✅"
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test/data/gherkin/unicode.feature');

    // Assert
    assert.strictEqual(result.name, 'Unicode Support 🌍');
    assert.strictEqual(result.test_cases.length, 3);
    assert.strictEqual(result.test_cases[0].name, 'Tester avec des accents français');
    assert.strictEqual(result.test_cases[1].name, 'Prueba con caracteres españoles');
    assert.strictEqual(result.test_cases[2].name, 'Test with emoji 😀');

    assert.ok(result.test_cases[0].steps[0].name.includes('François'));
    assert.ok(result.test_cases[2].steps[0].name.includes('测试用户'));
  });

  it('should handle feature with description but no background or scenarios', () => {
    // Arrange
    const mockFs = createMockFs(`
      @documentation
      Feature: Documentation Feature
        This is a detailed description
        spanning multiple lines
        with important information
        but no actual test scenarios yet
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./test.feature');

    // Assert
    assert.strictEqual(result.name, 'Documentation Feature');
    assert.strictEqual(result.test_cases.length, 0);
    assert.strictEqual(result.before_each.length, 0);
  });

  it('should generate consistent hashes for identical content', () => {
    // Arrange
    const content = `
      Feature: Hash Test

      Scenario: Test
        Given step
    `;
    const parser1 = new GherkinParser(createMockFs(content));
    const parser2 = new GherkinParser(createMockFs(content));

    // Act
    const result1 = parser1.parse('./test1.feature');
    const result2 = parser2.parse('./test2.feature');

    // Assert
    assert.strictEqual(result1.hash, result2.hash);
    assert.strictEqual(result1.test_cases[0].hash, result2.test_cases[0].hash);
  });

  it('should handle completely empty file', () => {
    // Arrange
    const mockFs = createMockFs('');
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./empty.feature');

    // Assert
    assert.strictEqual(result.type, 'feature');
    assert.strictEqual(result.name, '');
    assert.strictEqual(result.test_cases.length, 0);
  });

  it('should handle file with only whitespace and comments', () => {
    // Arrange
    const mockFs = createMockFs(`
      # Just comments
      # No actual content


      # More comments
    `);
    const parser = new GherkinParser(mockFs);

    // Act
    const result = parser.parse('./comments-only.feature');

    // Assert
    assert.strictEqual(result.name, '');
    assert.strictEqual(result.test_cases.length, 0);
  });
});