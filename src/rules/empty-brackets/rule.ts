
import { AST, Rule } from 'eslint'
import { docUrl } from '../util'

type Options = {
  array: boolean
  object: boolean
}

type ReportContext = {
  node: Rule.Node
  type: keyof Options
  isEnabled: boolean
  firstToken: AST.Token
  lastToken: AST.Token
}

const defaultOptions: Options = {
  array: false,
  object: true,
} as const

/**
 * Determine empty characters between two tokens
 *
 * @param token1 The first token
 * @param token2 The second token
 */
function getWhitespaceScore(token1: AST.Token, token2: AST.Token) {
  if (token1 && token2) {
    const diff = token2.range[0] - token1.range[1]
    // edge case for newline where range is 0, but the tokens are on different lines
    // which is not allowed, so we consider it as 2 whitespaces
    if (diff === 1 && token1.loc.end.line !== token2.loc.start.line) {
      return 2
    }
    return diff
  }
  return 0
}

function getReportDescriptor(context: ReportContext): Rule.ReportDescriptor | undefined {
  const { node, type, isEnabled, firstToken, lastToken } = context
  const whitespace = getWhitespaceScore(firstToken, lastToken)
  if (isEnabled) {
    if (whitespace === 0) {
      return {
        node,
        messageId: 'missing',
        data: {
          type,
        },
        fix(fixer) {
          return fixer.insertTextAfter(firstToken, ' ')
        },
      }
    } else if (whitespace > 1) {
      return {
        node,
        messageId: 'excessive',
        data: {
          type,
        },
        fix(fixer) {
          return fixer.replaceTextRange([firstToken.range[1], lastToken.range[0]], ' ')
        },
      }
    }
  } else {
    if (whitespace > 0) {
      return {
        node,
        messageId: whitespace === 1 ? 'present' : 'excessive',
        data: {
          type,
        },
        fix(fixer) {
          return fixer.removeRange([firstToken.range[1], lastToken.range[0]])
        },
      }
    }
  }
}

const emptyBrackets: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: {
      category: 'Style guide',
      description: 'Ensures a single space between empty brackets and braces',
      url: docUrl('empty-brackets'),
    },
    messages: {
      missing: 'Empty {{type}} literal should have a space',
      present: 'Empty {{type}} literal should not have a space',
      excessive: 'Excessive space between empty {{type}} literal',
    },
    schema: [
      {
        type: 'object',
        default: {
          array: false,
          object: true,
        },
        additionalProperties: false,
        properties: {
          array: {
            type: 'boolean',
          },
          object: {
            type: 'boolean',
          },
        },
      },
    ],
  },
  create(context) {
    const source = context.sourceCode
    const [{ array, object } = defaultOptions] = context.options as [Options]
    return {
      ArrayExpression(node) {
        if (node.elements.length === 0) {
          const firstToken = source.getFirstToken(node)
          const lastToken = source.getLastToken(node)
          if (firstToken && lastToken) {
            const descriptor = getReportDescriptor({
              node,
              type: 'array',
              isEnabled: array,
              firstToken,
              lastToken,
            })
            if (descriptor) {
              context.report(descriptor)
            }
          }
        }
      },
      ObjectExpression(node) {
        if (node.properties.length === 0) {
          const firstToken = source.getFirstToken(node)
          const lastToken = source.getLastToken(node)
          if (firstToken && lastToken) {
            const descriptor = getReportDescriptor({
              node,
              type: 'object',
              isEnabled: object,
              firstToken,
              lastToken,
            })
            if (descriptor) {
              context.report(descriptor)
            }
          }
        }
      },
    }
  },
}

export default emptyBrackets
