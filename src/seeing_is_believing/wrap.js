'use strict'
const esprima    = require('esprima')
const objectKeys = require('object-keys');

module.exports   = wrap

function wrap({code, aroundEach}) {
  const ast      = esprima.parse(code, {loc: true, range: true})
  const toRecord = {}
  const chunks   = code.split('')

  // walk top down and decorate / record for each line
  walk(ast, null, function(node, parent) {
    decorateNode(node, parent, chunks)
    const line = node.loc.end.line
    if(recordLeftOverRight(node, toRecord[line]))
      toRecord[line] = node
  })

  // walk bottom up and hand to cb for rewriting
  walk(ast, null, function(node, parent) {
    const line = node.loc.end.line
    if(node == toRecord[line])
      aroundEach(node, line)
  })

  return chunks.join('')
}

function recordLeftOverRight(left, right) {
  if(!left)  return false
  if(!right) return true
  const [ leftStart,  leftStop] = left.range
  const [rightStart, rightStop] = right.range
  if(leftStop  > rightStop)  return true  // left is farther right on the line
  if(leftStop  < rightStop)  return false // right is farther right on the line
  if(leftStart < rightStart) return true  // left starts earlier (wraps right)
  return false
}

function decorateNode(node, parent, chunks) {
  const [start, finish] = node.range
  node.parent = parent
  node.source = () => chunks.slice(start, finish).join('')

  const prev = node.update
  if(prev && typeof prev === 'object')
    for(let key in objectKeys(prev))
      update[key] = prev[key]
  node.update = update

  function update (s) {
    chunks[start] = s;
    for(let i = start + 1; i < finish; i++)
      chunks[i] = ''
  }
}


function walk(ast, parent, cb) {
  // console.dir(ast, {colors: true, depth: 5})
  switch(ast.type) {
    case "Literal":
    case "Identifier":
    case "BinaryExpression":
      cb(ast, parent)
      break
    case "ExpressionStatement":
      walk(ast.expression, ast, cb)
      break
    case "Program":
    case "BlockStatement":
      ast.body.forEach(child => walk(child, ast, cb))
      break
    case "ForInStatement":
    case "ForOfStatement":
      walk(ast.right, ast, cb)
      walk(ast.body,  ast, cb)
      break
    case "VariableDeclaration":
      ast.declarations.forEach(child => walk(child, ast, cb))
      break
    case "VariableDeclarator":
      ast.init && walk(ast.init, ast, cb)
      break
    default:
      console.dir(ast, {colors: true, depth: 6})
      throw(`What type of AST is ${ast.type}?`)
  }
}
