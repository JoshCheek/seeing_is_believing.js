#!/usr/bin/env node
const fs          = require('fs')
const programName = process.argv[1]
const args        = process.argv.slice(2)
const inputFile   = args[0]

fs.readFile(inputFile, 'utf8', (err, data) => {
  console.log(data)
})

// // this one reads in stdin and writes it to stdout
// let input = ""
// process.stdin.on('data', data => input += data)
// process.stdin.on('end', () => {
//   process.stdout.write(input)
// })
