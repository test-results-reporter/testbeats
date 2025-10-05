@e2e @api
Feature: User Management System
    In order to manage users effectively
    As an administrator
    I want to perform CRUD operations on user accounts

  Background:
    Given I am logged in as an administrator
    And I have access to the user management system

  @create @positive
  Scenario: Create a new user
    Given I have user data with name "John Doe"
    And I have user data with email "john@example.com"
    When I create the user
    Then I should see a success message
    And the user should be added to the system

  @read @positive
  Scenario: Retrieve user information
    Given a user exists with ID "12345"
    When I fetch the user details
    Then I should see the user's name
    And I should see the user's email
    But I should not see the user's password

  @update @positive
  Scenario: Update user information
    Given a user exists with ID "12345"
    When I update the user's email to "newemail@example.com"
    Then the user's email should be updated
    And I should see a confirmation message

  @delete @negative
  Scenario: Delete non-existent user
    Given a user does not exist with ID "99999"
    When I attempt to delete the user
    Then I should see an error message
    And the operation should fail
