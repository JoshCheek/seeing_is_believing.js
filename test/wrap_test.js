'use strict'

const assert = require('chai').assert
const wrap   = require('../src/seeing_is_believing/wrap')

// TODO:
// * The rest of https://github.com/estree/estree/blob/master/es2015.md
// * The other file in that spec
// * multiline expressions

describe('wrap', function() {
  function assertWraps(input, expected, aroundEach) {
    aroundEach = aroundEach || function(node, line) {
      node.update(`<${node.source()}>`)
    }
    const actual = wrap(input, aroundEach)
    assert.equal(actual, expected)
  }

  it('yields the current line to the wrapper function', function() {
    assertWraps(`'a'\n'b'`, `'a'+1\n'b'+2`, function(expression, line) {
      expression.update(`${expression.source()}+${line}`)
    })
  })

  it('does not wrap empty programs', function() {
    assertWraps('', '')
  })

  it.skip('does not wrap empty lines', function() {
    assertWraps("\n",   "\n")
    assertWraps("\n\n", "\n\n")
  })

  it('wraps function definitions')

  describe('variable declarations', function() {
    it('wraps nothing when a variable is declared without a value', function() {
      assertWraps("var abc;", "var abc;")
    })

    it('wraps the rightmost value of a variable declaration\'s value when present', function() {
      assertWraps("var abc = 123;",           "var abc = <123>;")
      assertWraps("var abc = 123, def = 456", "var abc = 123, def = <456>")

      assertWraps("let abc = 123;",           "let abc = <123>;")
      assertWraps("let abc = 123, def = 456", "let abc = 123, def = <456>")

      assertWraps("const abc = 123;",           "const abc = <123>;")
      assertWraps("const abc = 123, def = 456", "const abc = 123, def = <456>")
    })
  })

  describe('wrapping expressions', function() {
    specify('members', function() {
      assertWraps('a',     '<a>')
      assertWraps('a.b',   '<a.b>')
      assertWraps('a.b.c', '<a.b.c>')
    })

    specify('calls', function() {
      assertWraps('a()',     '<a()>')
      assertWraps('a.b()',   '<a.b()>')
      assertWraps('a.b.c()', '<a.b.c()>')
    })

    specify('the value of a spread expression is wrapped and the result is spread')
    specify('arrays')
    specify('arrow function bodies')
  })

  describe('for loops', function() {
    it('wraps the value and body of a for/in statements', function() {
      assertWraps("for (let a in b) { }",       "for (let a in <b>) { }")
      assertWraps("for (let a in b) c",         "for (let a in b) <c>")
      assertWraps("for (let a in b) {\n  c\n}", "for (let a in <b>) {\n  <c>\n}")
    })

    it('wrap the value and body of a for/of statements', function() {
      assertWraps("for (let a of b) { }",       "for (let a of <b>) { }")
      assertWraps("for (let a of b) c",         "for (let a of b) <c>")
      assertWraps("for (let a of b) {\n  c\n}", "for (let a of <b>) {\n  <c>\n}")
    })
  })
})
