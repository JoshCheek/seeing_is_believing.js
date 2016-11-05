'use strict'

const assert = require('chai').assert
const wrap   = require('../src/seeing_is_believing/wrap')

// TODO:
// * The rest of https://github.com/estree/estree/blob/master/es2015.md
// * The other file in that spec
// * multiline expressions

describe('wrap', function() {
  function assertWraps(input, expected, aroundEach) {
    aroundEach = aroundEach || function(line, node) {
      return {
        type:      "CallExpression",
        arguments: [node],
        callee:    {type: "Identifier", name: "W"},
      }
    }
    const actual = wrap({code: input, aroundEach: aroundEach})
    assert.equal(actual, expected)
  }

  it('yields the current line to the wrapper function', function() {
    assertWraps(`'a';\n'b';`, `'a1';\n'b2';`, function(line, directive) {
      directive.expression.value += line
      return directive
    })
  })

  it('does not wrap empty programs', function() {
    assertWraps('', '')
  })

  it.skip('does not wrap empty lines', function() {
    assertWraps("\n", "\n")
    assertWraps("\n\n", "\n\n")
  })

  it('wraps function definitions')

  describe('variable declarations', function() {
    it('wraps nothing when a variable is declared without a value', function() {
      assertWraps("var abc;", "var abc;")
    })

    it('wraps the rightmost value of a variable declaration\'s value when present', function() {
      assertWraps("var abc = 123;",            "var abc = W(123);")
      // assertWraps("var abc = 123, def = 456;", "var abc = 123, def = W(456);")

      assertWraps("let abc = 123;",            "let abc = W(123);")
      // assertWraps("let abc = 123, def = 456;", "let abc = 123, def = W(456);")

      assertWraps("const abc = 123;",            "const abc = W(123);")
      // assertWraps("const abc = 123, def = 456;", "const abc = 123, def = W(456);")
    })
  })

  describe('wrapping expressions', function() {
    specify('calls')
    specify('members')
    specify('the value of a spread expression is wrapped and the result is spread')
    specify('arrays')
    specify('arrow function bodies')
  })

  describe('for loops', function() {
    it('wraps the value and body of a for/in statements', function() {
      assertWraps("for (let a in b) {\n}", "for (let a in W(b)) {\n}")
      // assertWraps("for (let a in b) {\n    c\n}", "for (let a in b) {\n    W(c)\n}")
      // assertWraps("for (let a in b) c", "for (let a in b) W(c)")
    })

    it('wrap the value and body of a for/of statements', function() {
      assertWraps("for (let a of b) { }",   "for (let a of W(b)) {\n}")
      // assertWraps("for (let a of b) { c }", "for (let a of b) { W(c) }")
      // assertWraps("for (let a of b) c",     "for (let a of b) W(c)")
    })
  })
})
