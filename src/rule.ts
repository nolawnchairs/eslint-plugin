import { Rule } from 'eslint'
import {
  type ImportMap,
  getViolations,
} from './core'

export type Options = {
  /**
   * Glob pattern to match internal scoped (aliased) modules, normally starting
   * with an `@`, '~', or '$` symbol
   *
   * @type {string}
   */
  internalAliasPattern?: string

  /**
   * Glob pattern to match non-aliased internal modules, such as prefixing
   * with 'src/' or 'lib/'
   *
   * @type {string}
   */
  internalModulePattern?: string
}


const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Style guide',
      description: 'Enforce a convention in module import order',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          internalAliasPattern: {
            type: 'string',
          },
          internalModulePattern: {
            type: 'string',
          },
        },
      },
    ],
  },
  create(context: Rule.RuleContext) {
    const sourceCode = context.sourceCode
    const options: Options = context.options?.[0] ?? {}
    const importMap: ImportMap = new Map()

    function getDefinedImports(node: Rule.Node) {
      if (!importMap.has(node)) {
        importMap.set(node, [])
      }
      return importMap.get(node)!
    }

    return {
      ImportDeclaration(node) {
        if (node.specifiers.length) {
          const imported = getDefinedImports(node.parent)
          imported.push({
            rank: imported.length,
            code: sourceCode.getText(node),
            moduleName: String(node.source.value),
            node,
            loc: node.loc!,
            range: node.range!,
          })
        }
      },
      ['Program:exit']() {
        const violations = getViolations(importMap, options)
        for (const violation of violations) {
          context.report(violation)
        }
      }
    }
  }
}

export default rule

