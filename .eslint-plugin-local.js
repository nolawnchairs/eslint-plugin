
const { default: importOrder } = require('./lib/rules/import-order/rule')

// This loads rules from this project to be used to lint itself. For this
// to work, you must run "npm run build" in order to generate the lib folder
module.exports = {
  rules: {
    'import-order': importOrder,
  }
}