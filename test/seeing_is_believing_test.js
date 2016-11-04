'use strict'

const assert          = require('chai').assert
const SiB             = require('../src/seeing_is_believing')
const AggregateResult = require('../src/seeing_is_believing/handlers/aggregate_result')


describe('SeeingIsBelieving', function() {
  function assertRecords(code, assertions, done) {
    SiB({
      code: code,
      handler: AggregateResult(function(results) {
        for(let lineNum in assertions)
          assert.deepEqual(results.forLine(lineNum), assertions[lineNum])
        done && done()
      })
    })
  }

  it('records the results of single-line expressions', function(done) {
    assertRecords(`"a" + "b"`, {1: ['"ab"']}, done)
  })

  it('retains state across the lines', function(done) {
    assertRecords(`var char = "a" \n char`, {1: ['undefined'], 2: ['"a"']}, done)
  })
})
