'use strict'

module.exports = SeeingIsBelieving
function SeeingIsBelieving({code, handler}) {
  // intentinoally toplevel (temporarily)
  global.record = function(lineNum, value) {
    console.log(`RECORDED: ${lineNum}, ${value}`)
    // using snake case here to keep the interface consistent with the Ruby implementation
    handler(['line_result', {
      line_number: lineNum,
      inspected: '"ab"'
    }])
    return value
  }
  const rewrittenCode = rewriteCodeToRecord(code)
  console.log(rewrittenCode)
  eval(rewrittenCode)
  handler(['finished']);
}

function rewriteCodeToRecord(code) {
  let lineNum = 1
  return code.split("\n")
             .map(line => rewriteLine(lineNum++, line))
             .join("\n")
}

function rewriteLine(lineNum, line) {
  const inspectedLine = JSON.stringify(line)
  return `record(${lineNum}, eval(${inspectedLine}))`
  // if(line.startsWith("var")) {
  //   const [declaration, body] = line.split("=")
  //   return `${declaration}=record(${lineNum}, ${body})`
  // } else {
  //   return `record(${lineNum}, ${line})`
  // }
}
