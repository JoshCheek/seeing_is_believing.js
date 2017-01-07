'use strict'

module.exports = AggregateResult
function AggregateResult(callback) {
  const lineResultsSym = Symbol('lineResults')

  const result = {
    [lineResultsSym]: {},
    forLine: lineNum => result[lineResultsSym][lineNum]||[],
  }

  return resultHandler
  function resultHandler([type, data]) {
    switch (type) {
      case "line_result":
        const lineResults = result[lineResultsSym]
        const {line_number, inspected} = data
        if(!lineResults[line_number])
          lineResults[line_number] = []
        lineResults[line_number].push(inspected)
        break
      case "finished":
        callback(result)
        break
      default:
        throw(`Unknown result type: ${type}`)
    }
  }
}
