@background @example @setup
Feature: Background Section Examples
    As a test automation engineer
    I want to understand how Background sections work in Gherkin
    So that I can avoid repeating common setup steps across scenarios

  Background:
    Given I have a test database connection
    And I have a test user account created
    And I am logged into the application
    And I have the necessary permissions

  @positive @login
  Scenario: Successful user login
    When I enter valid username "testuser"
    And I enter valid password "testpass123"
    And I click the login button
    Then I should see the dashboard
    And I should see my user profile information

  @positive @profile
  Scenario: Update user profile
    When I navigate to the profile settings
    And I update my display name to "Updated User"
    And I save the changes
    Then I should see a success message
    And my display name should be updated to "Updated User"
