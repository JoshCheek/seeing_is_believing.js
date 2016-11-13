#!/usr/bin/env node
'use strict'
const fs              = require('fs')
const SiB             = require('../src/seeing_is_believing')
const AggregateResult = require('../src/seeing_is_believing/handlers/aggregate_result')

const programName     = process.argv[1]
const args            = process.argv.slice(2)
const inputFileName   = args[0]

const inputFile       = new Promise((resolve, reject) => {
  fs.readFile(inputFileName, 'utf8', (err, data) => {
    if(err) reject(err)
    else resolve(data)
  })
})

const inputLines = inputFile.then(body => body.match(/[^\r\n]+[\r\n]?/g))

const handler = AggregateResult((results) => {
  inputLines.then(lines => {
    let longestLine = ""
    for(let index = 0; index<lines.length; ++index) {
      let line = chomp(lines[index])
      if(longestLine.length < line.length)
        longestLine = line
		}

    for(let index=0; index<lines.length; ++index) {
      const inputLine = chomp(lines[index])

      let padding     = ""
      let paddingSize = longestLine.length - inputLine.length
      while(padding.length < paddingSize)
        padding += " "

      let result = results.forLine(index+1).join(" ")
      if(lines[index].endsWith("\n"))
        result += "\n"

      let outputLine = chomp(inputLine) + padding + "  // => " + result
      process.stdout.write(outputLine)
    }
  })
})

inputFile.then(code => SiB({code, handler}))


// // this one reads in stdin and writes it to stdout
// let input = ""
// process.stdin.on('data', data => input += data)
// process.stdin.on('end', () => {
//   process.stdout.write(input)
// })

function chomp(str) {
  if(str.endsWith("\n"))
    return str.slice(0, str.length-1)
  else
    return str
}
