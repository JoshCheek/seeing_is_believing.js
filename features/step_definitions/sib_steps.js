// deps
const assert   = require('chai').assert
const fs       = require('fs')
const path     = require('path')
const spawn    = require("child_process").spawn
const realpath = (path) => new Promise((resolve, reject) => {
  fs.realpath(path, (err, path) => {
    if(err) reject(err)
    else resolve(path)
  })
})
const mkdir = (dir) => new Promise((resolve, reject) => {
  fs.mkdir(dir, (err) => {
    if(err && err.code !== 'EEXIST') reject(err) // it's fine if it already exists
    else resolve(dir)
  })
})

// set up directories we'll be working with, cd to the proving grounds
const rootDir           = realpath(__filename).then(file => path.join(file, "../../.."))
const binDir            = rootDir.then(root => path.join(root, 'bin'))
const provingGroundsDir = rootDir.then(root => path.join(root, 'proving_grounds'))
const inProvingGrounds  = provingGroundsDir.then(mkdir).then(dir => {
  process.chdir(dir)
  return dir
})


module.exports = steps

function steps() {
  this.Given('the file "$filename":', function(filename, body, callback) {
    inProvingGrounds.then(dir => {
      fs.writeFile(filename, body, (err) => {
        if(err) throw(err)
        callback()
      })
    })
  })

  this.When('I run "$command"', function(command, cucumberCallback) {
    binDir.then(bin =>
      inProvingGrounds.then(provingGrounds => {
        const PATH    = `${bin}:${process.env.PATH}`
        const program = spawn(command, [], {env: {PATH}, stdio: ["pipe", "pipe", "pipe"], shell: true})
        program.stdin.end() // <-- eventually, this will need to be able to be set by another command

        let stdoutDone = false
        let stdout     = ""
        program.stdout.on('data', chunk => stdout += chunk)
        program.stdout.on('end', () => stdoutDone = true)

        let stderrDone = false
        let stderr     = ""
        program.stderr.on('data', chunk => stderr += chunk)
        program.stderr.on('end', () => stderrDone = true)

        let statusDone = false
        let status = null
        program.on('exit', (code, string) => {
          status = code
          statusDone = true
        })

        const callbackWhenProcessIsDone = () => {
          if(stdoutDone && stderrDone && statusDone) {
            this.lastCommand = {stdout: stdout, stderr: stderr, status: status}
            cucumberCallback()
          } else {
            setTimeout(callbackWhenProcessIsDone, 0)
          }
        }
        setTimeout(callbackWhenProcessIsDone, 0)
      })
    )
  })

  this.Then("stderr is empty", function (callback) {
    assert.equal(this.lastCommand.stderr, "")
    callback()
  })

  this.Then("the exit status is $status", function (status, callback) {
    assert.equal(this.lastCommand.status, status)
    callback()
  })

  this.Then("stdout is:", function (output, callback) {
    assert.equal(this.lastCommand.stdout, output)
    callback()
  })
}
