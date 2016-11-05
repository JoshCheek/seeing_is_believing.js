'use strict'

const util = require('util');
const vm   = require('vm');
const wrap = require('./seeing_is_believing/wrap')

// Events are snake case to keep the interface consistent with the Ruby implementation
// I think there's an event API for node that I should look into rather than remaking my own

module.exports = SeeingIsBelieving
function SeeingIsBelieving({code, handler}) {

  const script = new vm.Script(
    wrap(code, (ast, line) => ast.update(`record(${line}, ${ast.source()})`))
  )

  const sandbox = {
    record: function record(lineNum, value) {
      handler(['line_result', {
        line_number: lineNum,
        inspected:   util.inspect(value),
      }])
      return value
    }
  }

  script.runInNewContext(sandbox)
  handler(['finished'])
}
