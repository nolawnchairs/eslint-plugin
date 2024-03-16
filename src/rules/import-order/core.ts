import { AST, Rule } from 'eslint'
import { ImportDeclaration } from 'estree'
import { Options } from './rule'
import { deriveType } from './util'

export const IMPORT_TYPES = [
  'core', // Node.js core modules
  'external', // External modules (npm, et al)
  'scoped', // Scoped modules (e.g. @nestjs/common)
  'aliased', // Internal modules aliased by the user
  'internal', // Internal modules not aliased by the user
  'parent', // Parent module
  'sibling', // Sibling module
  'index', // Index module (e.g. ./index.js)
  'unknown', // No effin' clue
] as const

export type ImportType = typeof IMPORT_TYPES[number]
export type ImportMap = Map<Rule.Node, Import[]>

type ImportNode = ImportDeclaration & Rule.NodeParentExtension
type Import = {
  rank: number
  moduleName: string
  code: string
  node: ImportNode
  loc: AST.SourceLocation
  range: AST.Range
}

type GroupedImports = Map<ImportType, Import[]>
type ImportStrategy = 'default' | 'named' | 'namespace' | 'mixed'

const groupOrder: ImportType[] = [
  'core',
  'external',
  'scoped',
  'aliased',
  'internal',
  'parent',
  'sibling',
  'index',
  'unknown',
]

const strategyOrder: ImportStrategy[] = [
  'default',
  'namespace',
  'mixed',
  'named',
]

/**
 * Create a map of imports with their ideal order
 *
 * @export
 * @param {ImportMap} declaredImports
 * @param {Options} options
 * @return {*}  {ImportMap}
 */
export function createIdealOrderMap(declaredImports: ImportMap, options: Options): ImportMap {
  const map: ImportMap = new Map()
  const grouped = groupImports(declaredImports, options)
  let i = 0
  for (const importType of groupOrder) {
    const imports = grouped.get(importType)?.slice().sort(getSortFunction(importType)) ?? []
    for (const imp of imports) {
      if (!map.has(imp.node)) {
        map.set(imp.node, [])
      }
      const list = map.get(imp.node)!
      list.push({ ...imp, rank: i++ })
    }
  }
  return map
}

/**
 * Group imports by import type
 *
 * @export
 * @param {ImportMap} declaredImports
 * @param {Options} options
 * @return {*}  {GroupedImports}
 */
export function groupImports(declaredImports: ImportMap, options: Options): GroupedImports {
  const grouped: GroupedImports = new Map()
  for (const imports of declaredImports.values()) {
    for (const i of imports) {
      const type = deriveType(i.moduleName, options)
      if (!grouped.has(type)) {
        grouped.set(type, [])
      }
      const group = grouped.get(type)!
      group.push(i)
    }
  }
  return grouped
}

/**
 * Compute violations to be reported
 *
 * @export
 * @param {ImportMap} declared
 * @param {Options} options
 * @return {*}  {Rule.ReportDescriptor[]}
 */
export function generateReport(declared: ImportMap, options: Options): Rule.ReportDescriptor[] {
  const descriptors = Array<Rule.ReportDescriptor>()
  const declaredOrder = getMapValues(declared)
  const idealOrder = getMapValues(createIdealOrderMap(declared, options))
  for (const declared of declaredOrder.values()) {
    const { match, messageId, data } = getReportContext(declared, idealOrder)
    if (match.rank !== declared.rank) {
      descriptors.push({
        node: declared.node,
        messageId,
        data,
        fix: (fixer: Rule.RuleFixer) =>
          fixer.replaceTextRange(
            declared.range,
            idealOrder[declared.rank]!.code
          ),
      })
    }
  }
  return descriptors
}

/**
 * Compute the context for a given import's report
 *
 * @export
 * @param {Import} declared
 * @param {Import[]} idealList
 * @throws {Error} If the ideal list does not contain the declared module
 */
export function getReportContext(declared: Import, idealList: Import[]) {
  const rank = idealList.findIndex((imp) => imp.moduleName === declared.moduleName)
  if (rank === -1) {
    // This should never happen, because the ideal list is derived from the
    // declared list so it should always contain the declared module.
    throw new Error(`Ideal list does not contain "${declared.moduleName}"`)
  }

  if (rank === 0) {
    return {
      match: idealList[rank]!,
      messageId: 'mustOccurFirst',
      data: {
        moduleName: declared.moduleName,
        total: idealList.length.toString(),
        after: '',
        rank: '0',
      },
    }
  }

  return {
    match: idealList[rank]!,
    messageId: 'mustOccurAfter',
    data: {
      moduleName: declared.moduleName,
      after: idealList[rank - 1]!.moduleName,
      total: idealList.length.toString(),
      rank: (rank + 1).toString(),
    },
  }
}

/**
 * Flatten the values of an import map to an array of import objects
 *
 * @export
 * @param {ImportMap} importMap
 * @return {*}  {Import[]}
 */
export function getMapValues(importMap: ImportMap): Import[] {
  return Array.from(importMap.values()).reduce((acc, val) => acc.concat(val), [])
}

/**
 * Create the sort function for a given import type
 *
 * @param {ImportType} type
 * @return {*} {(a: Import, b: Import) => number}
 */
function getSortFunction(type: ImportType): (a: Import, b: Import) => number {
  return (a: Import, b: Import) => {
    const aStrategy = detectImportStrategy(a)
    const bStrategy = detectImportStrategy(b)

    if (aStrategy !== bStrategy) {
      return strategyOrder.indexOf(aStrategy) - strategyOrder.indexOf(bStrategy)
    }

    if (!a.moduleName.includes('/') && !b.moduleName.includes('/')) {
      return a.moduleName.toLowerCase()
        .localeCompare(b.moduleName.toLowerCase())
    }

    if (~['parent', 'sibling', 'index'].indexOf(type)) {
      const aParts = a.moduleName.split('/')
      const bParts = b.moduleName.split('/')

      if (aParts.length > bParts.length) {
        return -1
      }
      if (aParts.length < bParts.length) {
        return 1
      }
    }

    return a.moduleName.toLowerCase()
      .localeCompare(b.moduleName.toLowerCase())
  }
}

/**
 * Detect the import strategy for a given import
 *
 * @export
 * @param {Import} imp
 * @return {*}  {ImportStrategy}
 */
export function detectImportStrategy(imp: Import): ImportStrategy {
  // import a from 'a'
  if (imp.node.specifiers.length === 1 && imp.node.specifiers[0]!.type === 'ImportDefaultSpecifier') {
    return 'default'
  }
  // import { a } from 'a'
  if (imp.node.specifiers.every((s) => s.type === 'ImportSpecifier')) {
    return 'named'
  }
  // import * as a from 'a'
  if (imp.node.specifiers.length === 1 && imp.node.specifiers[0]!.type === 'ImportNamespaceSpecifier') {
    return 'namespace'
  }
  // import a, { b } from 'a'
  return 'mixed'
}
