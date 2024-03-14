import { AST, Rule } from 'eslint'
import { ImportDeclaration } from 'estree'
import { deriveType } from './util'
import { Options } from './rule'

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
  for (const [_, imports] of declaredImports) {
    for (const imp of imports) {
      const type = deriveType(imp.moduleName, options)
      if (!grouped.has(type)) {
        grouped.set(type, [])
      }
      const group = grouped.get(type)!
      group.push(imp)
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
  const violations = Array<Rule.ReportDescriptor>()
  const declaredOrder = getMapValues(declared)
  const idealOrder = getMapValues(createIdealOrderMap(declared, options))
  for (const declared of declaredOrder.values()) {
    const { match, message } = findIdealRank(declared, idealOrder)
    if (match.rank !== declared.rank) {
      violations.push({
        node: declared.node,
        message,
        fix: (fixer: Rule.RuleFixer) =>
          fixer.replaceTextRange(
            declared.range,
            idealOrder[declared.rank]!.code
          )
      })
    }
  }
  return violations
}

/**
 * Find the ideal rank for a given import
 *
 * @export
 * @param {Import} declared
 * @param {Import[]} idealList
 * @return {*} 
 */
export function findIdealRank(declared: Import, idealList: Import[]) {
  const match = idealList.findIndex((imp) => imp.moduleName === declared.moduleName)
  if (match === -1) {
    // This should never happen, because the ideal list is derived from the
    // declared list so it should always contain the declared module.
    throw new Error(`Ideal list does not contain "${declared.moduleName}"`)
  }
  return {
    match: idealList[match]!,
    message: match === 0
      ? `Import for "${declared.moduleName}" must be first (0)`
      : `Import for "${declared.moduleName}" must be after "${idealList[match - 1]!.moduleName}" (${match})`
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
      return a.moduleName.localeCompare(b.moduleName)
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
  if (imp.node.specifiers.every(s => s.type === 'ImportSpecifier')) {
    return 'named'
  }
  // import * as a from 'a'
  if (imp.node.specifiers.length === 1 && imp.node.specifiers[0]!.type === 'ImportNamespaceSpecifier') {
    return 'namespace'
  }
  // import a, { b } from 'a'
  return 'mixed'
}
