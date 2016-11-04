'use strict'

describe('SeeingIsBelieving', function() {
  it('records the results of single-line expressions', function(done) {
    assertRecords(`"a" + "b"`, {1: ['"ab"']}, done)
  })
  it('retains state across the lines', function(done) {
    assertRecords(`var char = "a" \n char`, {1: ['undefined'], 2: ['"a"']}, done)
  })
})
