'use strict'

const util = require('util');
const vm   = require('vm');

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
  const preamble = ""
  let   lineNum  = 0
  const rewrittenLines = code
          .split("\n")
          .map(line => {
            ++lineNum
            if(line.startsWith("var")) {
              const [declaration, body] = line.split("=")
              return `${declaration}=record(${lineNum}, ${body})`

            } else {
              return `record(${lineNum}, ${line})`
            }
          })
          .join("\n")
  return preamble + rewrittenLines
}
