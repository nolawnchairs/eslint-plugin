
import { resolve, dirname, isAbsolute, normalize } from 'path'
import { ImportDeclaration } from 'estree'
import { Rule } from 'eslint'

type Options = {
  alias?: Record<string, string>
}

type Alias = {
  token: string
  rootPath: string
  path: string
}

const defaultAlias = {
  '@app': 'src',
}

/**
 * Check if the given path is a relative import
 *
 * @export
 * @param {string} path
 * @return {*}  {boolean}
 */
export function isRelativeImport(path: string): boolean {
  return /^(\.\/)?\.\.?\//.test(path)
}

/**
 * Check if the given path is valid. Returns false if
 * illegal characters are found. Slashes / are allowed,
 * as we're checking partial paths
 *
 * @export
 * @param {string} path
 * @return {*}  {boolean}
 */
export function isValidPath(path: string): boolean {
  return !/[<>:"|?*\u0000-\u001F]/g.test(path)
}

/**
 * Find the first matching alias for the given source path
 *
 * @export
 * @param {string} sourcePath the import literal value
 * @param {string} currentFile the current file containing the import, relative to project root
 * @param {Options} [options]
 * @return {*}  {(Alias | undefined)}
 */
export function findMatchingAlias(sourcePath: string, currentFile: string, options?: Options): Alias | undefined {
  const { alias = defaultAlias } = options ?? {}
  const dir = dirname(currentFile)
  for (const [token, aliasRoot] of Object.entries(alias)) {
    const normal = normalize(aliasRoot)
    if (~dir.split('/').indexOf(normal)) {
      const rootPath = isAbsolute(aliasRoot) ? aliasRoot : resolve(normal)
      const absoluteSourcePath = resolve(dir, sourcePath)
      return {
        token,
        rootPath,
        path: absoluteSourcePath.replace(rootPath, token),
      }
    }
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Enforce aliased imports instead of relative imports for application code',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        default: {
          alias: defaultAlias,
        },
        additionalProperties: false,
        properties: {
          alias: {
            type: 'object',
          },
        },
      },
    ],
  },
  create: (context: Rule.RuleContext) => {
    const options: Options = context.options?.[0] ?? {}
    return {
      ImportDeclaration(node: ImportDeclaration & Rule.NodeParentExtension) {
        const source = String(node.source.value)
        if (isValidPath(context.filename) && isRelativeImport(source)) {
          const match = findMatchingAlias(source, context.filename, options)
          if (match) {
            context.report({
              node,
              message: `Use aliased import "${match.path}" instead of relative "${source}"`,
              fix: (fixer) => fixer.replaceText(node.source, `'${match.path}'`),
            })
          } else {
            context.report({
              node,
              message: `No alias defined for path "${source}"`,
            })
          }
        }
      },
    }
  },
}

export default rule
