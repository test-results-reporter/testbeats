@nested @example
Feature: Nested Feature
    As a test automation engineer
    I want to test nested folder structures
    So that I can verify the sync helper works correctly

  @positive @nested
  Scenario: Nested Scenario
    Given I have a nested step
    When I execute nested
    Then I see nested result
