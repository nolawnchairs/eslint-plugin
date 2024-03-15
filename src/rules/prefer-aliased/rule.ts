
import {
  resolve,
  dirname,
  isAbsolute,
  normalize,
} from 'path'
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
export function findMatchingAlias(sourcePath: string, currentFile: string, options: Options): Alias | undefined {
  const { alias = defaultAlias } = options
  const dir = dirname(currentFile)
  for (const [token, aliasRoot] of Object.entries(alias)) {
    const normalized = normalize(aliasRoot)
    if (~dir.split('/').indexOf(normalized)) {
      const absoluteSourcePath = resolve(dir, sourcePath)
      const rootPath = isAbsolute(aliasRoot)
        ? aliasRoot
        : resolve(normalized)
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
  create(context) {
    const [options = {}] = context.options as [Options]
    return {
      ImportDeclaration(node) {
        const declared = String(node.source.value)
        if (isValidPath(context.filename) && isRelativeImport(declared)) {
          const alias = findMatchingAlias(declared, context.filename, options)
          if (alias) {
            context.report({
              node,
              message: `Use aliased import "${alias.path}" instead of relative "${declared}"`,
              fix: (fixer) => fixer.replaceText(node.source, `'${alias.path}'`),
            })
          } else {
            context.report({
              node,
              message: `No alias defined for path "${declared}"`,
            })
          }
        }
      },
    }
  },
}

export default rule
