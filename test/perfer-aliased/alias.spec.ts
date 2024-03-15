
import { findMatchingAlias, isRelativeImport, isValidPath } from '../../src/rules/prefer-aliased/rule'

describe('find-matching-alias', () => {

  it('should match alias in same directory', () => {
    const result = findMatchingAlias('./foo', 'src/index.ts', {})
    expect(result).toMatchObject({
      token: '@app',
      rootPath: expect.stringMatching(/src$/),
      path: '@app/foo',
    })
  })

  it('should match alias in same directory', () => {
    const result = findMatchingAlias('./foo', 'src/index.ts', {})
    expect(result).toMatchObject({
      token: '@app',
      rootPath: expect.stringMatching(/src$/),
      path: '@app/foo',
    })
  })

  it('should match alias in subdirectory', () => {
    const result = findMatchingAlias('../foo', 'src/bar/index.ts', {})
    expect(result).toMatchObject({
      token: '@app',
      rootPath: expect.stringMatching(/src$/),
      path: '@app/foo',
    })
  })

  it('should use defined alias token provided in options', () => {
    const result = findMatchingAlias('./foo', 'src/index.ts', { alias: { '@pak': './src' } })
    expect(result).toMatchObject({
      token: '@pak',
      rootPath: expect.stringMatching(/src$/),
      path: '@pak/foo',
    })
  })

  it('should use defined alias root provided in options', () => {
    const result = findMatchingAlias('./foo', 'source/index.ts', { alias: { '@app': './source' } })
    expect(result).toMatchObject({
      token: '@app',
      rootPath: expect.stringMatching(/source$/),
      path: '@app/foo',
    })
  })

  it('should not find an alias if none match', () => {
    const result = findMatchingAlias('./foo', 'src/index.ts', { alias: { '@pak': './source' } })
    expect(result).toBeUndefined()
  })
})

describe('is-relative-import', () => {

  it('should return true for relative imports', () => {
    expect(isRelativeImport('./foo')).toBe(true)
    expect(isRelativeImport('../foo')).toBe(true)
    expect(isRelativeImport('../../foo')).toBe(true)
  })

  it('should return false for absolute imports', () => {
    expect(isRelativeImport('@app/foo')).toBe(false)
    expect(isRelativeImport('foo')).toBe(false)
  })
})

describe('is-valid-path', () => {

  it('should return true for valid paths', () => {
    expect(isValidPath('./foo')).toBe(true)
    expect(isValidPath('../foo')).toBe(true)
    expect(isValidPath('../../foo')).toBe(true)
    expect(isValidPath('@app/foo')).toBe(true)
    expect(isValidPath('foo')).toBe(true)
  })

  it('should return false for invalid paths', () => {
    expect(isValidPath('foo<bar')).toBe(false)
    expect(isValidPath('foo>bar')).toBe(false)
    expect(isValidPath('foo:bar')).toBe(false)
    expect(isValidPath('foo|bar')).toBe(false)
    expect(isValidPath('foo?bar')).toBe(false)
    expect(isValidPath('foo*bar')).toBe(false)
    expect(isValidPath('foo\u0000bar')).toBe(false)
    expect(isValidPath('foo\u001Fbar')).toBe(false)
    expect(isValidPath('<input>')).toBe(false)
    expect(isValidPath('<text>')).toBe(false)
  })
})
