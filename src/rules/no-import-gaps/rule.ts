
import { AST, Rule } from 'eslint'
import { docUrl } from '../util'

type Imports = Array<{
  range: AST.Range
  line: number
}>

const noImportGaps: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: {
      category: 'Style guide',
      description: 'Enforces the absencse of newlines between import statements.',
      url: docUrl('no-import-gaps'),
    },
    messages: {
      forbidden: 'No newline gaps allowed between import statements',
    },
    schema: [],
  },
  create(context) {
    const imports: Imports = []
    return {
      ImportDeclaration(node) {
        const { range, loc } = node
        if (range && loc) {
          const line = loc.start.line
          imports.push({ range, line })
        }
      },
      ['Program:exit']() {
        if (!imports.length) {
          return
        }
        for (let i = 0; i < imports.length - 1; i++) {
          const current = imports[i]!
          const next = imports[i + 1]
          if (!next) {
            break
          }
          if (next.line - current.line > 1) {
            context.report({
              loc: {
                start: {
                  line: current.line + 1,
                  column: 0,
                },
                end: {
                  line: next.line - 1,
                  column: 0,
                },
              },
              messageId: 'forbidden',
              fix(fixer) {
                return fixer.replaceTextRange([current.range[1], next.range[0]], '\n')
              },
            })
          }
        }
      },
    }
  },
}

export default noImportGaps
