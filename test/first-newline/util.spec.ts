
import endent from 'endent'
import { countStartingNewlines, isShebangOrStringDirective } from '../../src/rules/first-newline/rule'

describe('newline', () => {

  it('should count the newlines at the start of the string', () => {
    expect(countStartingNewlines('foo')).toBe(0)
    expect(countStartingNewlines('\nfoo')).toBe(1)
    expect(countStartingNewlines('\n\n\nfoo')).toBe(3)
  })

  it('should detect no shebang or directive at the first line', () => {
    const code = endent`
      console.log('hello')
    `
    const [first] = code.split('\n')
    expect(isShebangOrStringDirective(first!)).toBe(false)
  })

  it('should detect a shebang at the first line', () => {
    const code = endent`
      #!/usr/bin/env node
      console.log('hello')
    `
    const [first] = code.split('\n')
    expect(isShebangOrStringDirective(first!)).toBe(true)
  })

  it('should detect a string directive at the first line', () => {
    const code = endent`
      'use strict'

      console.log('hello')
    `
    const [first] = code.split('\n')
    expect(isShebangOrStringDirective(first!)).toBe(true)
  })
})
