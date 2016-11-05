'use strict'
const esprima   = require('esprima')
const escodegen = require('escodegen')

module.exports = wrap

function wrap({code, aroundEach}) {
  let ast         = esprima.parse(code)
  let wrappedAst  = wrapAst(ast, aroundEach)
  let wrappedCode = escodegen.generate(wrappedAst)
  return wrappedCode
}

function wrapAst(ast, aroundEach) {
  let newAst = dup(ast)
  switch(ast.type) {
    case "Literal":
    case "Identifier":
    case "ExpressionStatement":
      newAst = aroundEach(1, ast)
      break
    case "Program":
    case "BlockStatement":
      newAst.body = ast.body.map(element => wrapAst(element, aroundEach))
      break
    case "ForInStatement":
    case "ForOfStatement":
      newAst.right = wrapAst(ast.right, aroundEach)
      newAst.body  = wrapAst(ast.body, aroundEach)
      break
    case "VariableDeclaration":
      newAst.declarations = ast.declarations.map(decl => {
        return wrapAst(decl, aroundEach)
      })
      break
    case "VariableDeclarator":
      if(ast.init)
        newAst.init = wrapAst(ast.init, aroundEach)
      break
    default:
      console.dir(ast, {colors: true, depth: 6})
      throw(`What type of AST is ${ast.type}?`)
  }
  return newAst
}

function dup(obj) {
  const duped = Object.create(obj)
  for(let key in obj)
    duped[key] = obj[key]
  return duped
}
