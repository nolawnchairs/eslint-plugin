
import endent from 'endent'
import { RuleTester } from 'eslint'
import rule from '../../src/rules/empty-brackets/rule'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'empty-brackets': 'error', // For some reason, this doesn't get passed to the rule
  },
})

ruleTester.run('empty-brackets', rule, {
  valid: [
    {
      name: 'array enabled',
      code: 'const foo = [ ]',
      options: [{ array: true }],
    },
    {
      name: 'array disabled',
      code: 'const foo = []',
      options: [{ array: false }],
    },
    {
      name: 'array disabled using default',
      code: 'const foo = []',
    },
    {
      name: 'object enabled',
      code: 'const foo = { }',
      options: [{ object: true }],
    },
    {
      name: 'object enabled using default',
      code: 'const foo = { }',
    },
    {
      name: 'object disabled',
      code: 'const foo = {}',
      options: [{ object: false }],
    },
    {
      name: 'object and array enabled',
      code: endent`
        const foo = { }
        const bar = [ ]
      `,
      options: [{ object: true, array: true }],
    },
    {
      name: 'object and array disabled',
      code: endent`
        const foo = {}
        const bar = []      
      `,
      options: [{ object: false, array: false }],
    },
  ],
  invalid: [
    {
      name: 'array enabled',
      code: 'const foo = []',
      output: 'const foo = [ ]',
      options: [{ array: true }],
      errors: [
        {
          messageId: 'missing',
          data: {
            type: 'array',
          },
        },
      ],
    },
    {
      name: 'multiline array enabled',
      code: endent`
      {
        const foo = [

        ]
        const bar = [
        ]
      }
      `,
      output: endent`
      {
        const foo = [ ]
        const bar = [ ]
      }
      `,
      options: [{ array: true }],
      errors: [
        {
          messageId: 'newlines',
          data: {
            type: 'array',
          },
        },
        {
          messageId: 'newlines',
          data: {
            type: 'array',
          },
        },
      ],
    },
    {
      name: 'array disabled',
      code: 'const foo = [ ]',
      output: 'const foo = []',
      options: [{ array: false }],
      errors: [
        {
          messageId: 'present',
          data: {
            type: 'array',
          },
        },
      ],
    },
    {
      name: 'array with many spaces disabled',
      code: 'const foo = [   ]',
      output: 'const foo = []',
      options: [{ array: false }],
      errors: [
        {
          messageId: 'excessive',
          data: {
            type: 'array',
          },
        },
      ],
    },
    {
      name: 'array disabled using default',
      code: 'const foo = [ ]',
      output: 'const foo = []',
      errors: [
        {
          messageId: 'present',
          data: {
            type: 'array',
          },
        },
      ],
    },
    {
      name: 'object enabled',
      code: 'const foo = {}',
      output: 'const foo = { }',
      options: [{ object: true }],
      errors: [
        {
          messageId: 'missing',
          data: {
            type: 'object',
          },
        },
      ],
    },
    {
      name: 'object enabled using default',
      code: 'const foo = {}',
      output: 'const foo = { }',
      errors: [
        {
          messageId: 'missing',
          data: {
            type: 'object',
          },
        },
      ],
    },
    {
      name: 'object disabled',
      code: 'const foo = { }',
      output: 'const foo = {}',
      options: [{ object: false }],
      errors: [
        {
          messageId: 'present',
          data: {
            type: 'object',
          },
        },
      ],
    },
    {
      name: 'object with many spaces disabled',
      code: 'const foo = {   }',
      output: 'const foo = {}',
      options: [{ object: false }],
      errors: [
        {
          messageId: 'excessive',
          data: {
            type: 'object',
          },
        },
      ],
    },
    {
      name: 'object with many spaces enabled',
      code: 'const foo = {   }',
      output: 'const foo = { }',
      options: [{ object: true }],
      errors: [
        {
          messageId: 'excessive',
          data: {
            type: 'object',
          },
        },
      ],
    },
    {
      name: 'multiline object disabled',
      code: endent`
        const foo = {
        }
        const bar = {

        }
      `,
      output: endent`
        const foo = {}
        const bar = {}
      `,
      options: [{ object: false }],
      errors: [
        {
          messageId: 'newlines',
          data: {
            type: 'object',
          },
        },
        {
          messageId: 'newlines',
          data: {
            type: 'object',
          },
        },
      ],
    },
    {
      name: 'object and array enabled',
      code: 'const foo = {}\nconst bar = []',
      output: 'const foo = { }\nconst bar = [ ]',
      options: [{ object: true, array: true }],
      errors: [
        {
          messageId: 'missing',
          data: {
            type: 'object',
          },
        },
        {
          messageId: 'missing',
          data: {
            type: 'array',
          },
        },
      ],
    },
    {
      name: 'object and array disabled',
      code: 'const foo = { }\nconst bar = [ ]',
      output: 'const foo = {}\nconst bar = []',
      options: [{ object: false, array: false }],
      errors: [
        {
          messageId: 'present',
          data: {
            type: 'object',
          },
        },
        {
          messageId: 'present',
          data: {
            type: 'array',
          },
        },
      ],
    },
  ],
})
