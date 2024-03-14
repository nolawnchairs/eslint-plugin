
import isCoreModule from 'is-core-module'
import { minimatch } from 'minimatch'
import { ImportType } from './core'
import { Options } from './rule'

/**
 * Check if a module is a scoped module provided by an external package
 *
 * @export
 * @param {string} moduleName
 * @param {Options} options
 */
export function isScopedModule(moduleName: string, options: Options) {
  return moduleName.startsWith('@')
    && !isCoreModule(moduleName)
    && !isDeclaredInternalAliasedModule(moduleName, options)
}

/**
 * Check if a module is declared as an internally aliased module as defined
 * by the user's configuration
 *
 * @export
 * @param {string} moduleName
 * @param {Options} options
 */
export function isDeclaredInternalAliasedModule(moduleName: string, options: Options) {
  return options.internalAliasPattern
    ? minimatch(moduleName, options.internalAliasPattern)
    : false
}

/**
 * Check if a module is declared as an internal module as defined
 * by the user's configuration
 *
 * @export
 * @param {string} moduleName
 * @param {Options} options
 */
export function isDeclaredInternalModule(moduleName: string, options: Options) {
  return options.internalModulePattern
    ? minimatch(moduleName, options.internalModulePattern)
    : false
}

/**
 * Check if a module is an externally installed module from npm, but not
 * scoped to an organization
 *
 * @export
 * @param {string} moduleName
 * @param {Options} options
 */
export function isExternalModule(moduleName: string, options: Options) {
  return !isCoreModule(moduleName)
    && !isDeclaredInternalAliasedModule(moduleName, options)
    && !isDeclaredInternalModule(moduleName, options)
    && !isScopedModule(moduleName, options)
}

/**
 * Check if a module is a project-internal sibling module
 *
 * @export
 * @param {string} moduleName
 */
export function isSiblingModule(moduleName: string) {
  return !isIndexModule(moduleName)
    && !isParentModule(moduleName)
    && moduleName.startsWith('.')
}

/**
 * Check if a module is a project-internal parent module
 *
 * @export
 * @param {string} moduleName
 */
export function isParentModule(moduleName: string) {
  return moduleName.startsWith('..')
}

/**
 * Check if a module is a project-internal index module
 *
 * @export
 * @param {string} moduleName
 */
export function isIndexModule(moduleName: string) {
  return [
    '.',
    './',
    './index',
    './index.js',
    './index.cjs',
    './index.mjs',
    './index.jsx',
    './index.ts',
    './index.tsx'
  ].indexOf(moduleName) > -1
}

/**
 * Check if a module is a relative, project-internal module
 *
 * @export
 * @param {string} moduleName
 */
export function isInternalRelativeModule(moduleName: string) {
  return isSiblingModule(moduleName)
    || isParentModule(moduleName)
    || isIndexModule(moduleName)
}

/**
 * Derive the type of import for a given module name
 *
 * @export
 * @param {string} moduleName
 * @param {Options} options
 * @return {*}  {ImportType}
 */
export function deriveType(moduleName: string, options: Options): ImportType {
  if (isCoreModule(moduleName)) {
    return 'core'
  } else if (isScopedModule(moduleName, options)) {
    return 'scoped'
  } else if (isDeclaredInternalModule(moduleName, options)) {
    return 'internal'
  } else if (isDeclaredInternalAliasedModule(moduleName, options)) {
    return 'aliased'
  } else if (isSiblingModule(moduleName)) {
    return 'sibling'
  } else if (isParentModule(moduleName)) {
    return 'parent'
  } else if (isIndexModule(moduleName)) {
    return 'index'
  } else if (isExternalModule(moduleName, options)) {
    return 'external'
  }
  return 'unknown'
}
