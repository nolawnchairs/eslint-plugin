
import endent from 'endent'
import { RuleTester } from 'eslint'
import rule from '../../src/rules/no-iife/rule'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-iife': 'error',
  },
})

ruleTester.run('no-iife', rule, {
  valid: [
    {
      name: 'standalone function',
      code: endent`
        function foo() {
          console.log('foo');
        }
      `,
    },
    {
      name: 'standalone async function',
      code: endent`
        async function foo() {
          await Promise.resolve('foo');
          console.log('foo');
        }
      `,
    },
  ],
  invalid: [
    {
      name: 'anonymous iife',
      code: endent`
        (function() {
          console.log('foo');
        })();
      `,
      output: endent`
        function autoFixedFn() {
          console.log('foo');
        }

        autoFixedFn();
      `,
      errors: [
        {
          messageId: 'forbidden',
        },
      ],
    },
    {
      name: 'anonymous arrow iife',
      code: endent`
        (() => {
          console.log('foo');
        })();
      `,
      output: endent`
        function autoFixedFn() {
          console.log('foo');
        }

        autoFixedFn();
      `,
      errors: [
        {
          messageId: 'forbidden',
        },
      ],
    },
    {
      name: 'anonymous arrow async iife',
      code: endent`
        (async () => {
          await Promise.resolve('foo');
          console.log('foo');
        })();
      `,
      output: endent`
        async function autoFixedFn() {
          await Promise.resolve('foo');
          console.log('foo');
        }

        autoFixedFn();
      `,
      errors: [
        {
          messageId: 'forbidden',
        },
      ],
    },
    {
      name: 'async anonymous iife',
      code: endent`
        (async function() {
          await Promise.resolve('foo');
          console.log('foo');
        })();
      `,
      output: endent`
        async function autoFixedFn() {
          await Promise.resolve('foo');
          console.log('foo');
        }

        autoFixedFn();
      `,
      errors: [
        {
          messageId: 'forbidden',
        },
      ],
    },
    {
      name: 'named iife',
      code: endent`
        (function foo() {
          console.log('foo');
        })();
      `,
      output: endent`
        function foo() {
          console.log('foo');
        }

        foo();
      `,
      errors: [
        {
          messageId: 'forbidden',
        },
      ],
    },
    {
      name: 'named async iife',
      code: endent`
        (async function foo() {
          console.log('foo');
        })();
      `,
      output: endent`
        async function foo() {
          console.log('foo');
        }

        foo();
      `,
      errors: [
        {
          messageId: 'forbidden',
        },
      ],
    },
    {
      name: 'iife preceded with semi-colon',
      code: endent`
        let bar = 1

        ;(function() {
          console.log('foo');
        })();
      `,
      output: endent`
        let bar = 1

        function autoFixedFn() {
          console.log('foo');
        }

        autoFixedFn();
      `,
      errors: [
        {
          messageId: 'forbidden',
        },
      ],
    },
  ],
})
