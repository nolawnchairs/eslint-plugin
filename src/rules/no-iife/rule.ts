
import { Rule } from 'eslint'
import { docUrl } from '../util'

type Options = {
  autoFixFunctionName?: string
}

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
    schema: [
      {
        type: 'object',
        properties: {
          autoFixFunctionName: {
            type: 'string',
            default: 'autoFixedFn',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const code = context.sourceCode
    const { autoFixFunctionName = 'autoFixedFn' } = context.options[0] ?? {} as Options
    return {
      CallExpression(node) {
        const precededBySemiColon = code.getTokenBefore(node)?.value === ';'
        if (node.callee.type === 'FunctionExpression') {
          const isAsync = node.callee.async
          const functionBody = code.getText(node.callee.body)
          const functionName = node.callee.id?.name ?? autoFixFunctionName
          context.report({
            node,
            messageId: 'forbidden',
            fix(fixer) {
              return [
                fixer.removeRange([node.range![0] - (precededBySemiColon ? 1 : 0), node.range![0]]),
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
                fixer.insertTextBefore(node, `${isAsync ? 'async ' : ''}function ${autoFixFunctionName}() `),
                fixer.insertTextAfter(node, `\n\n${autoFixFunctionName}()`),
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
