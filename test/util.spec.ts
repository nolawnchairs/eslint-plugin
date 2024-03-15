
import {
  deriveType,
  isDeclaredInternalModule,
  isDeclaredInternalAliasedModule,
  isExternalModule,
  isInternalRelativeModule,
  isParentModule,
  isScopedModule,
  isSiblingModule,
  isIndexModule,
} from '../src/util'

describe('Utility Functions', () => {

  it('should identify user-declared scoped modules', () => {
    const options = { internalAliasPattern: '@app/**/*' }
    expect(isDeclaredInternalAliasedModule('@app/my-module', options)).toBe(true)
    expect(isDeclaredInternalAliasedModule('@app/my-module/submodule', options)).toBe(true)
    expect(isDeclaredInternalAliasedModule('@nestjs/common', options)).toBe(false)
    expect(isDeclaredInternalAliasedModule('axios', options)).toBe(false)
  })

  it('should identify user-declared internal modules', () => {
    const options = { internalModulePattern: 'src/**/*' }
    expect(isDeclaredInternalModule('src/my-module', options)).toBe(true)
    expect(isDeclaredInternalModule('src/my-module/submodule', options)).toBe(true)
    expect(isDeclaredInternalModule('src/nestjs/common', options)).toBe(true)
    expect(isDeclaredInternalModule('axios', options)).toBe(false)
    expect(isDeclaredInternalModule('fs', options)).toBe(false)
    expect(isDeclaredInternalModule('@nestjs/common', options)).toBe(false)
  })

  it('should identify external scoped modules', () => {
    const options = { internalAliasPattern: '@app/**/*' }
    expect(isScopedModule('@app/my-module', options)).toBe(false)
    expect(isScopedModule('@app/my-module/submodule', options)).toBe(false)
    expect(isScopedModule('@nestjs/common', options)).toBe(true)
    expect(isScopedModule('@nestjs/common/lib/injectable', options)).toBe(true)
    expect(isScopedModule('axios', options)).toBe(false)
  })

  it('should identify standard external modules', () => {
    const options = { internalAliasPattern: '@app/**/*' }
    expect(isExternalModule('axios', options)).toBe(true)
    expect(isExternalModule('axios/lib/submodule', options)).toBe(true)
    expect(isExternalModule('fs', options)).toBe(false)
    expect(isExternalModule('@nestjs/core', options)).toBe(false)
    expect(isExternalModule('@app/module/some.service', options)).toBe(false)
    expect(isExternalModule('@app/some.service', options)).toBe(false)
  })

  it('should identify any internal module', () => {
    expect(isInternalRelativeModule('./my-module')).toBe(true)
    expect(isInternalRelativeModule('./my-module/submodule')).toBe(true)
    expect(isInternalRelativeModule('../my-module')).toBe(true)
    expect(isInternalRelativeModule('../my-module/submodule')).toBe(true)
    expect(isInternalRelativeModule('../../../../my-module/submodule')).toBe(true)
    expect(isInternalRelativeModule('my-module')).toBe(false)
  })

  it('should identify a sibling module', () => {
    expect(isSiblingModule('./my-module')).toBe(true)
    expect(isSiblingModule('./my-module/submodule')).toBe(true)
    expect(isSiblingModule('../my-module')).toBe(false)
    expect(isSiblingModule('../../my-module')).toBe(false)
    expect(isSiblingModule('my-module')).toBe(false)
  })

  it('should identify a parent module', () => {
    expect(isParentModule('..')).toBe(true)
    expect(isParentModule('../..')).toBe(true)
    expect(isParentModule('../../..')).toBe(true)
    expect(isParentModule('./my-module')).toBe(false)
    expect(isParentModule('my-module')).toBe(false)
  })

  it('should identify an index module', () => {
    expect(isIndexModule('.')).toBe(true)
    expect(isIndexModule('./')).toBe(true)
    expect(isIndexModule('./index')).toBe(true)
    expect(isIndexModule('./index.js')).toBe(true)
    expect(isIndexModule('./index.jsx')).toBe(true)
    expect(isIndexModule('./index.cjs')).toBe(true)
    expect(isIndexModule('./index.mjs')).toBe(true)
    expect(isIndexModule('./index.ts')).toBe(true)
    expect(isIndexModule('./index.tsx')).toBe(true)
    expect(isIndexModule('my-module')).toBe(false)
  })

  it('should derive the correct import type', () => {
    const options = {
      internalAliasPattern: '@app/**/*',
      internalModulePattern: 'src/**/*',
    }
    expect(deriveType('fs', options)).toBe('core')
    expect(deriveType('fs/promises', options)).toBe('core')
    expect(deriveType('axios', options)).toBe('external')
    expect(deriveType('axios/lib/submodule', options)).toBe('external')
    expect(deriveType('@nestjs/common', options)).toBe('scoped')
    expect(deriveType('@nestjs/common/lib/injectable', options)).toBe('scoped')
    expect(deriveType('src/my-module', options)).toBe('internal')
    expect(deriveType('src/my-module/submodule', options)).toBe('internal')
    expect(deriveType('@app/my-module', options)).toBe('aliased')
    expect(deriveType('@app/my-module/submodule', options)).toBe('aliased')
    expect(deriveType('./my-module', options)).toBe('sibling')
    expect(deriveType('../my-module', options)).toBe('parent')
    expect(deriveType('../../my-module', options)).toBe('parent')
    expect(deriveType('./', options)).toBe('index')
    expect(deriveType('.', options)).toBe('index')
  })
})