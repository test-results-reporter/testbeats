@smoke @regression
Feature: Basic Calculator Operations
    As a user
    I want to perform basic calculations
    So that I can get accurate results

  @positive @math
  Scenario: Addition of two numbers
    Given I have number 5 in calculator
    And I have number 3 in calculator
    When I add the numbers
    Then I should see result 8

  @negative @math
  Scenario: Subtraction of two numbers
    Given I have number 10 in calculator
    When I subtract 4
    Then I should see result 6
