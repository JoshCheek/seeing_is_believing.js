'use strict'

module.exports = AggregateResult
function AggregateResult(callback) {
  const LINE_RESULTS = Symbol('lineResults')

  const result = {
    [LINE_RESULTS]: {},
    forLine: n => result[LINE_RESULTS][n]||[],
  }

  return function resultHandler([type, data]) {
    switch (type) {
      case "line_result":
        const lineResults = result[LINE_RESULTS]
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
