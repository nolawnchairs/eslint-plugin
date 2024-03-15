
import { RuleTester } from 'eslint'
import rule from '../../src/rules/prefer-aliased/rule'

/*
  Ensure that the rule is working as expected
  by running it against a set of valid and invalid code

  Valid imports:
  - import { Foo } from '@app/foo/services/foo.service'
  - import { App } from '@app/app.module'

  Invalid imports:
  - import { Foo } from '../foo/services/foo.service' -> import { Foo } from '@app/foo/services/foo.service'
  - import { App } from './app.module' -> import { App } from '@app/app.module'
*/

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prefer-aliased': [{ alias: { '@app': '../src' } }],
  },
})

const filenameInSrcRoot = 'src/index.ts'

ruleTester.run('prefer-aliased', rule, {
  valid: [
    {
      name: 'import from aliased path',
      code: 'import { Foo } from "@app/foo";',
      filename: filenameInSrcRoot,
    },
    {
      name: 'import from built-in module',
      code: 'import fs from "node:fs";',
      filename: filenameInSrcRoot,
    },
    {
      name: 'import from external module',
      code: 'import { thing } from "some-module";',
      filename: filenameInSrcRoot,
    },
    {
      name: 'import from external scoped module',
      code: 'import { thing } from "@some-scope/some-module";',
      filename: filenameInSrcRoot,
    },
  ],
  invalid: [
    {
      filename: filenameInSrcRoot,
      name: 'import from relative path',
      code: 'import { Foo } from "./foo";',
      output: 'import { Foo } from \'@app/foo\';',
      errors: [
        {
          message: 'Use aliased import "@app/foo" instead of relative "./foo"',
        },
      ],
    },
    {
      filename: filenameInSrcRoot,
      code: 'import { Foo } from "./foo";',
      errors: [
        {
          message: 'No alias defined for path "./foo"',
        },
      ],
      options: [
        { alias: { '@app': '../not-src' } },
      ],
    },
  ],
})
