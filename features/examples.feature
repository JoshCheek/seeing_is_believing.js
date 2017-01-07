Feature: SeeingIsBelieving
  Scenario: Simple example
    Given the file "simple_example.js":
    """
    var a = 100
    var b = 20

    a + b
    """
    When I run "seeing_is_believing.js simple_example.js"
    Then stderr is empty
    And the exit status is 0
    And stdout is:
    """
    var a = 100  // => 100
    var b = 20   // => 20

    a + b        // => 120
    """
