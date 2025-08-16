@mixed @content @example
Feature: Mixed Content Feature
    As a test automation engineer
    I want to test mixed folder structures
    So that I can verify the sync helper works with various content types

  @positive @mixed
  Scenario: Mixed Content Scenario
    Given I have a mixed content step
    When I execute mixed content
    Then I see mixed content result
