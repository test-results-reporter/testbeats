@sub @folder @example
Feature: Sub Folder Feature
    As a test automation engineer
    I want to test sub folder structures
    So that I can verify the sync helper works with sub-folders

  @positive @sub
  Scenario: Sub Folder Scenario
    Given I have a sub folder step
    When I execute sub folder
    Then I see sub folder result
