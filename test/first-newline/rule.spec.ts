
import { RuleTester } from 'eslint'
import rule from '../../src/rules/first-newline/rule'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
})

ruleTester.run('first-newline', rule, {
  valid: [
    {
      name: 'has a single newline when always is set',
      code: '\nconst foo = 1',
      options: ['always'],
    },
    {
      name: 'has no newlines when never is set',
      code: 'const foo = 1',
      options: ['never'],
    },
    {
      name: 'has two newlines after a shebang when always is set',
      code: '#!/usr/bin/env node\n\nconst foo = 1',
      options: ['always'],
    },
    {
      name: 'has two newlines after a string directive when always is set',
      code: '"use strict";\n\nconst foo = 1',
      options: ['always'],
    },
    {
      name: 'has two newlines after a shebang when never is set',
      code: '#!/usr/bin/env node\n\nconst foo = 1',
      options: ['never'],
    },
    {
      name: 'has two newlines after a string directive when never is set',
      code: '"use strict";\n\nconst foo = 1',
      options: ['never'],
    },
  ],
  invalid: [
    // Always with no newline
    {
      name: 'has no newlines when always is set',
      code: 'const foo = 1',
      output: '\nconst foo = 1',
      options: ['always'],
      errors: [
        {
          messageId: 'newline-required',
        },
      ],
    },
    // Always with two newlines
    {
      name: 'has two newlines when always is set',
      code: '\n\nconst foo = 1',
      output: '\nconst foo = 1',
      options: ['always'],
      errors: [
        {
          messageId: 'newline-required',
        },
      ],
    },
    // Always with > 2 newlines
    {
      name: 'has > 2 newlines when always is set',
      code: '\n\n\nconst foo = 1',
      output: '\nconst foo = 1',
      options: ['always'],
      errors: [
        {
          messageId: 'newline-required',
        },
      ],
    },
    // Never with a single newline
    {
      name: 'has a single newline when never is set',
      code: '\nconst foo = 1',
      output: 'const foo = 1',
      options: ['never'],
      errors: [
        {
          messageId: 'newline-forbidden',
        },
      ],
    },
    // Never with > 1 newline
    {
      name: 'has > 1 newlines when never is set',
      code: '\n\nconst foo = 1',
      output: 'const foo = 1',
      options: ['never'],
      errors: [
        {
          messageId: 'newline-forbidden',
        },
      ],
    },
    // Never with shebang, followed by a single newline
    {
      name: 'has a single newline after a shebang when never is set',
      code: '#!/usr/bin/env node\nconst foo = 1',
      output: '#!/usr/bin/env node\n\nconst foo = 1',
      options: ['never'],
      errors: [
        {
          messageId: 'newline-required',
        },
      ],
    },
    // Always with shebang, followed by a single newline
    {
      name: 'has a single newline after a shebang when always is set',
      code: '#!/usr/bin/env node\nconst foo = 1',
      output: '#!/usr/bin/env node\n\nconst foo = 1',
      options: ['always'],
      errors: [
        {
          messageId: 'newline-required',
        },
      ],
    },
    // Never with string directive, followed by a single newline
    {
      name: 'has a single newline after a string directive when never is set',
      code: '"use strict";\nconst foo = 1',
      output: '"use strict";\n\nconst foo = 1',
      options: ['never'],
      errors: [
        {
          messageId: 'newline-required',
        },
      ],
    },
    // Always with string directive, followed by a single newline
    {
      name: 'has a single newline after a string directive when always is set',
      code: '"use strict";\nconst foo = 1',
      output: '"use strict";\n\nconst foo = 1',
      options: ['always'],
      errors: [
        {
          messageId: 'newline-required',
        },
      ],
    },
  ],
})
