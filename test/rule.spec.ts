import endent from 'endent'
import { RuleTester } from 'eslint'
import rule from '../src/rule'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'import-order': [{ internalAliasPattern: '@lib/**/*' }], // For some reason, this doesn't get passed to the rule
  },
})

ruleTester.run('import-order', rule, {
  valid: [
    {
      name: 'single core import',
      code: endent`
        import path from 'node:path';
      `,
    },
    {
      name: 'single external import',
      code: endent`
        import foo from 'foo';
      `,
    },
    {
      name: 'multiple imports ordered properly',
      code: endent`
        import path from 'node:path';
        import foo from 'foo';
        import { bar } from 'bar';
        import { baz } from 'baz';
        import { doTheThing } from '@aaa/thing';
        import { Other } from '@org/other/dist/other';
        import { Thing } from '@org/thing';
        import { Sleep } from '@zzz/zzz';
      `,
    },
    {
      name: 'multiple imports ordered properly accounting for internal alias',
      options: [{ internalAliasPattern: '@lib/**/*' }],
      code: endent`
        import fs from 'fs';
        import bar from 'bar';
        import { baz } from 'baz';
        import { Other } from '@org/other/dist/other';
        import { Thing } from '@org/thing';
        import { Mine } from '@lib/mine/thing';
      `,
    }
  ],
  invalid: [
    {
      name: 'multiple imports ordered improperly',
      code: endent`
        import { bar } from 'bar';
        import fs from 'fs';
      `,
      output: endent`
        import fs from 'fs';
        import { bar } from 'bar';
      `,
      errors: [
        {
          message: 'Import for "bar" must be after "fs" (1)',
          type: 'ImportDeclaration',

        },
        {
          message: 'Import for "fs" must be first (0)',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      name: 'multiple imports ordered improperly accounting for internal alias',
      options: [{ internalAliasPattern: '@lib/**/*' }],
      code: endent`
        import fs from 'fs';
        import { Thing } from '@org/thing';
        import bar from 'bar';
        import { Mine } from '@lib/mine';
        import { baz } from 'baz';
        import { Other } from '@org/other/dist/other';
      `,
      output: endent`
        import fs from 'fs';
        import bar from 'bar';
        import { baz } from 'baz';
        import { Other } from '@org/other/dist/other';
        import { Thing } from '@org/thing';
        import { Mine } from '@lib/mine';
      `,
      errors: [
        {
          message: 'Import for "@org/thing" must be after "@org/other/dist/other" (4)',
          type: 'ImportDeclaration',
        },
        {
          message: 'Import for "bar" must be after "fs" (1)',
          type: 'ImportDeclaration',
        },
        {
          message: 'Import for "@lib/mine" must be after "@org/thing" (5)',
          type: 'ImportDeclaration',
        },
        {
          message: 'Import for "baz" must be after "bar" (2)',
          type: 'ImportDeclaration',
        },
        {
          message: 'Import for "@org/other/dist/other" must be after "baz" (3)',
          type: 'ImportDeclaration',
        },
      ],
    },
  ]
})
