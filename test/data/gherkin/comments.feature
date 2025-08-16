# This is a single-line comment at the top of the file
# Feature file demonstrating Gherkin comments usage
# Comments start with # and can be placed anywhere in the file

@comments @example @documentation
Feature: Comment Examples in Gherkin
    # This comment is on the same line as the Feature
    As a developer
    I want to understand how to use comments in Gherkin
    So that I can document my test scenarios effectively

  # Background section with inline comment
  Background:
    Given I have a test environment set up
    And I am ready to run tests

  # Positive test scenario with detailed comments
  @positive @basic
  Scenario: Basic comment usage
    # This scenario shows basic comment usage
    Given I have a feature file open # Inline comment example
    When I add comments to explain the steps
    # Multi-line comment example:
    # Comments can span multiple lines
    # to provide detailed explanations
    Then I should see clear documentation
    And the code should be more maintainable

  # Negative test scenario with step-level comments
  @negative @advanced
  Scenario: Advanced comment patterns
    # This scenario demonstrates advanced comment patterns
    Given I have a complex test flow
    # I can add comments between steps
    # to explain the logic or requirements
    When I execute the test
    # Comments can also explain expected outcomes
    Then I should see the expected results
    # End of scenario comment

# End of file comment
# This file demonstrates various comment usage patterns in Gherkin
