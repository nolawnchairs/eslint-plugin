
import endent from 'endent'
import { RuleTester } from 'eslint'
import rule from '../../src/rules/no-import-gaps/rule'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-import-gaps': 'error', // For some reason, this doesn't get passed to the rule
  },
})

ruleTester.run('no-import-gaps', rule, {
  valid: [
    {
      name: 'single import',
      code: endent`
        import path from 'node:path';
      `,
    },
    {
      name: 'multiple imports',
      code: endent`
        import path from 'node:path';
        import foo from 'foo';
        import { bar } from 'bar';
        import { baz } from 'baz';

        console.log(foo);
      `,
    },
  ],
  invalid: [
    {
      name: 'multiple imports with gap',
      code: endent`
        import fs from 'fs';

        import bar from 'bar';
        import { baz } from 'baz';

        console.log(foo);
      `,
      output: endent`
        import fs from 'fs';
        import bar from 'bar';
        import { baz } from 'baz';

        console.log(foo);
      `,
      errors: [
        {
          messageId: 'forbidden',
        },
      ],
    },
  ],
})
