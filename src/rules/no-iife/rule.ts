
import { Rule } from 'eslint'
import { docUrl } from '../util'

const autoFixFn = 'autoFixedFn'

const noIife: Rule.RuleModule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      category: 'Style guide',
      description: 'Disallows usage of IIFE\'s (Immediately Invoked Function Expressions)',
      url: docUrl('no-iife'),
    },
    messages: {
      forbidden: 'Immediately Invoked Function Expressions (IIFE\'s) are not allowed. Use a function declaration instead.',
    },
    schema: [],
  },
  create(context) {
    const code = context.sourceCode
    return {
      CallExpression(node) {
        const precededBySemi = code.getTokenBefore(node)?.value === ';'
        if (node.callee.type === 'FunctionExpression') {
          const isAsync = node.callee.async
          const functionBody = code.getText(node.callee.body)
          const functionName = node.callee.id?.name ?? autoFixFn
          context.report({
            node,
            messageId: 'forbidden',
            fix(fixer) {
              return [
                fixer.removeRange([node.range![0] - (precededBySemi ? 1 : 0), node.range![0]]),
                fixer.insertTextBefore(node, `${isAsync ? 'async ' : ''}function ${functionName}() `),
                fixer.insertTextAfter(node, `\n\n${functionName}()`),
                fixer.replaceText(node, functionBody),
              ]
            },
          })
        } else if (node.callee.type === 'ArrowFunctionExpression') {
          const isAsync = node.callee.async
          const functionBody = code.getText(node.callee.body)
          context.report({
            node,
            messageId: 'forbidden',
            fix(fixer) {
              return [
                fixer.insertTextBefore(node, `${isAsync ? 'async ' : ''}function ${autoFixFn}() `),
                fixer.insertTextAfter(node, `\n\n${autoFixFn}()`),
                fixer.replaceText(node, functionBody),
              ]
            },
          })
        }
      },
    }
  },
}

export default noIife
