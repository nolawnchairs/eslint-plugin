
const { default: importOrder } = require('./lib/rules/import-order/rule')
const { default: firstNewline } = require('./lib/rules/first-newline/rule')
const { default: noIife } = require('./lib/rules/no-iife/rule')

// This loads rules from this project to be used to lint itself. For this
// to work, you must run "npm run build" in order to generate the lib folder
module.exports = {
  rules: {
    'import-order': importOrder,
    'first-newline': firstNewline,
    'no-iife': noIife
  }
}
