'use strict'

const inspect = require('util').inspect
const runCode = require('vm').runInNewContext
const wrap    = require('./seeing_is_believing/wrap')

// Events are snake case to keep the interface consistent with the Ruby implementation
// I think there's an event API for node that I should look into rather than remaking my own
module.exports = SeeingIsBelieving

function SeeingIsBelieving({code, handler}) {
  runCode(rewriteCode(code), sandboxFor(handler))
  handler(['finished'])
}

function rewriteCode(code) {
  return wrap(code, (ast, lineNum) => {
    ast.update(`record(${lineNum}, ${ast.source()})`)
  })
}

function sandboxFor(handler) {
  return { record }
  function record(lineNum, value) {
    handler(['line_result', {
      line_number: lineNum,
      inspected:   inspect(value),
    }])
    return value
  }
}
