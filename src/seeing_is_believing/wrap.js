'use strict'
const esprima  = require('esprima')

module.exports = wrap

function wrap(code, aroundEach) {
  const ast          = esprima.parse(code, {loc: true, range: true})
  const toWrap       = {}
  const sourceChunks = code.split('')

  // decorate / identify lines to wrap
  walk(ast, null, (node, parent) => {
    decorateNode(node, parent, sourceChunks)
    if(shouldRecordPotentialOverPrev(node, toWrap[node.loc.end.line]))
      toWrap[node.loc.end.line] = node
  })

  // wrap the identified lines
  walk(ast, null, (node, parent) => {
    if(node == toWrap[node.loc.end.line])
      aroundEach(node, node.loc.end.line)
  })

  return sourceChunks.join('')
}


// assumes potential exists, and they both end on the same line
function shouldRecordPotentialOverPrev(potential, prev) {
  if(!prev) return true
  const [potentialStart, potentialEnd] = potential.range
  const [     prevStart,      prevEnd] = prev.range
  if(potentialEnd   > prevEnd)   return true
  if(potentialEnd   < prevEnd)   return false
  if(potentialStart < prevStart) return true
  return false
}


function decorateNode(node, parent, sourceChunks) {
  const [start, finish] = node.range
  node.parent = parent
  node.source = () => sourceChunks.slice(start, finish).join('')
  node.update = (newSource) => {
    sourceChunks[start] = newSource
    for(let i = start + 1; i < finish; i++)
      sourceChunks[i] = ''
  }
}


function walk(ast, parent, cb) {
  // console.dir(ast, {colors: true, depth: 5})
  switch(ast.type) {
    case "Literal":
    case "Identifier":
    case "BinaryExpression":
    case "MemberExpression":
    case "CallExpression":
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
