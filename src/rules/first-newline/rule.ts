
import { AST, Rule } from 'eslint'

type Options = 'always' | 'never'

/**
 * Count the number of newlines at the start of a string
 *
 * @export
 * @param {string} text
 * @return {*}  {number}
 */
export function countStartingNewlines(text: string): number {
  return text.match(/^\n+/)?.[0].length ?? 0
}

/**
 * Determine if the given text is a shebang or string directive
 * e.g. #!/usr/bin/env node or "use strict"
 *
 * @export
 * @param {string} text
 */
export function isShebangOrStringDirective(text: string) {
  return text.slice(0, 2) === '#!'
    || ['"', '\''].includes(text.slice(0, 1))
}

const firstNewline: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: {
      category: 'Stylistic Issues',
      description: 'Enforce each file starts with a single newline',
      url: 'https://github.com/nolawnchairs/eslint-plugin/blob/master/src/rules/first-newline/README.md',
    },
    messages: {
      'newline-required': 'File must start with a single newline',
      'newline-forbidden': 'File must not start with newlines',
    },
    schema: [
      {
        enum: ['always', 'never'],
        default: 'always',
      },
    ],
  },
  create(context) {
    const [state = 'always'] = context.options as [Options]
    return {
      Program(node) {
        const { sourceCode } = context
        const code = sourceCode.getText()
        const currentFirstLine = code.slice(0, code.indexOf('\n'))
        const hasHashOrStringDirective = isShebangOrStringDirective(currentFirstLine)
        const evaluatableCode = hasHashOrStringDirective
          ? code.slice(code.indexOf('\n') + 1)
          : code
        const nlCount = countStartingNewlines(evaluatableCode)
        const loc: AST.SourceLocation = {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: evaluatableCode.indexOf('\n'),
          },
        }

        // If the file starts with a shebang or string directive, the rule
        // always applies
        if (hasHashOrStringDirective) {
          if (evaluatableCode.startsWith('\n') && nlCount === 1) {
            return
          } else {
            const range = [code.indexOf('\n') + 1, 1] satisfies AST.Range
            return context.report({
              node,
              loc,
              messageId: 'newline-required',
              fix: (fixer) => {
                return fixer.insertTextBeforeRange(range, '\n')
              },
            })
          }
        }

        const rangeStart = hasHashOrStringDirective
          ? code.indexOf('\n') + 1
          : 0

        if (state === 'always') {
          if (evaluatableCode.startsWith('\n') && nlCount === 1) {
            return
          }
          context.report({
            node,
            loc,
            messageId: 'newline-required',
            fix: (fixer) => {
              const range = [rangeStart, nlCount] satisfies AST.Range
              return fixer.replaceTextRange(range, '\n')
            },
          })
        } else { // state === 'never'
          if (nlCount > 0) {
            context.report({
              node,
              loc,
              messageId: 'newline-forbidden',
              fix: (fixer) => {
                const range = [rangeStart, nlCount] satisfies AST.Range
                return fixer.replaceTextRange(range, '')
              },
            })
          }
        }
      },
    }
  },
}

export default firstNewline
