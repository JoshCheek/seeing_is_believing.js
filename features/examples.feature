Feature: SeeingIsBelieving
  Scenario: Simple example
    Given the file "simple_example.js":
    """
    var a = 1
    var b = 2
    a + b
    """
    When I run "seeing_is_believing.js simple_example.js"
    Then stderr is empty
    And the exit status is 0
    And stdout is:
    """
    var a = 1  // => 1
    var b = 2  // => 2
    a + b      // => 3
    """
