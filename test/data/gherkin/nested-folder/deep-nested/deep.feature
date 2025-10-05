@deep @nested @example
Feature: Deep Nested Feature
    As a test automation engineer
    I want to test deep nested folder structures
    So that I can verify the sync helper works with complex hierarchies

  @positive @deep
  Scenario: Deep Nested Scenario
    Given I have a deep nested step
    When I execute deep nested
    Then I see deep nested result
