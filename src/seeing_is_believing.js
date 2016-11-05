'use strict'

const util = require('util');
const vm   = require('vm');
const wrap = require('./seeing_is_believing/wrap')

module.exports = SeeingIsBelieving
function SeeingIsBelieving({code, handler}) {
  const rewrittenCode = rewriteCodeToRecord(code)
  const script        = new vm.Script(rewrittenCode)
  const sandbox       = {
    record: record
  }
  script.runInNewContext(sandbox)
  handler(['finished']);

  // intentinoally toplevel (temporarily)
  function record(lineNum, value) {
    // using snake case here to keep the interface consistent with the Ruby implementation
    handler(['line_result', {
      line_number: lineNum,
      inspected:   util.inspect(value),
    }])
    return value
  }
}

function rewriteCodeToRecord(code) {
  return wrap({
    code: code,
    aroundEach: function(line, ast) {
      return {
        "type": "CallExpression",
        "callee": {"type": "Identifier", "name": "record"},
        "arguments": [{"type": "Literal", "value": line, "raw": `${line}`}, ast]
      }
    }
  })
}
