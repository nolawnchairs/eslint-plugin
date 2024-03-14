
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
    expect(isDeclaredInternalAliasedModule('@app/mymodule', options)).toBe(true)
    expect(isDeclaredInternalAliasedModule('@app/mymodule/submodule', options)).toBe(true)
    expect(isDeclaredInternalAliasedModule('@nestjs/common', options)).toBe(false)
    expect(isDeclaredInternalAliasedModule('axios', options)).toBe(false)
  })

  it('should identify user-declared internal modules', () => {
    const options = { internalModulePattern: 'src/**/*' }
    expect(isDeclaredInternalModule('src/mymodule', options)).toBe(true)
    expect(isDeclaredInternalModule('src/mymodule/submodule', options)).toBe(true)
    expect(isDeclaredInternalModule('src/nestjs/common', options)).toBe(true)
    expect(isDeclaredInternalModule('axios', options)).toBe(false)
    expect(isDeclaredInternalModule('fs', options)).toBe(false)
    expect(isDeclaredInternalModule('@nestjs/common', options)).toBe(false)
  })

  it('should identify external scoped modules', () => {
    const options = { internalAliasPattern: '@app/**/*' }
    expect(isScopedModule('@app/mymodule', options)).toBe(false)
    expect(isScopedModule('@app/mymodule/submodule', options)).toBe(false)
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
    expect(isInternalRelativeModule('./mymodule')).toBe(true)
    expect(isInternalRelativeModule('./mymodule/submodule')).toBe(true)
    expect(isInternalRelativeModule('../mymodule')).toBe(true)
    expect(isInternalRelativeModule('../mymodule/submodule')).toBe(true)
    expect(isInternalRelativeModule('../../../../mymodule/submodule')).toBe(true)
    expect(isInternalRelativeModule('mymodule')).toBe(false)
  })

  it('should identify a sibling module', () => {
    expect(isSiblingModule('./mymodule')).toBe(true)
    expect(isSiblingModule('./mymodule/submodule')).toBe(true)
    expect(isSiblingModule('../mymodule')).toBe(false)
    expect(isSiblingModule('../../mymodule')).toBe(false)
    expect(isSiblingModule('mymodule')).toBe(false)
  })

  it('should identify a parent module', () => {
    expect(isParentModule('..')).toBe(true)
    expect(isParentModule('../..')).toBe(true)
    expect(isParentModule('../../..')).toBe(true)
    expect(isParentModule('./mymodule')).toBe(false)
    expect(isParentModule('mymodule')).toBe(false)
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
    expect(isIndexModule('mymodule')).toBe(false)
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
    expect(deriveType('src/mymodule', options)).toBe('internal')
    expect(deriveType('src/mymodule/submodule', options)).toBe('internal')
    expect(deriveType('@app/mymodule', options)).toBe('aliased')
    expect(deriveType('@app/mymodule/submodule', options)).toBe('aliased')
    expect(deriveType('./mymodule', options)).toBe('sibling')
    expect(deriveType('../mymodule', options)).toBe('parent')
    expect(deriveType('../../mymodule', options)).toBe('parent')
    expect(deriveType('./', options)).toBe('index')
    expect(deriveType('.', options)).toBe('index')
  })
})