
export default {
  // ESLint
  'arrow-parens': 'error',
  'eol-last': 'error',
  'new-parens': 'error',
  'no-console': 'warn',
  'no-multi-spaces': 'error',
  'no-multiple-empty-lines': [
    'error',
    {
      max: 1,
      maxEOF: 0,
      maxBOF: 1,
    },
  ],
  'no-trailing-spaces': 'error',
  'no-var': 'error',
  'object-curly-spacing': ['error', 'always'],
  'prefer-const': [
    'error',
    {
      destructuring: 'any',
    },
  ],
  'prefer-template': 'error',
  'quotes': ['error', 'single'],
  'quote-props': ['error', 'consistent-as-needed'],
  'semi': ['error', 'never'],
  'spaced-comment': ['warn', 'always'],

  // Typescript ESLint
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/block-spacing': 'error',
  '@typescript-eslint/comma-dangle': [
    'error',
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      enums: 'always',
      exports: 'always-multiline',
      functions: 'never',
    },
  ],
  '@typescript-eslint/indent': [
    'error',
    2,
    {
      SwitchCase: 1,
      FunctionExpression: { parameters: 'first' },
      ignoredNodes: [
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
        'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
      ],
    },
  ],
  '@typescript-eslint/no-mixed-enums': 'error',
  '@typescript-eslint/no-base-to-string': 'error',
  '@typescript-eslint/no-loop-func': 'error',
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unused-vars': 'off', // Turn off in favor of unused-imports
  '@typescript-eslint/return-await': 'error',
  '@typescript-eslint/space-before-blocks': 'error',

  // Unused Imports
  'unused-imports/no-unused-imports': 'error',
  // Use this in favor of @typescript-eslint/no-unused-vars or no-unused-vars
  'unused-imports/no-unused-vars': [
    'warn',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    }
  ],

  // Import
  'import/newline-after-import': 'error',
  'import/no-default-export': 'error',
  'import/no-deprecated': 'warn',
  'import/no-mutable-exports': 'error',
  'import/no-self-import': 'error',
  'import/no-unassigned-import': ['error', {
    allow: [
      'dotenv/config',
      'polyfills',
      '**/*-polyfill',
      '**/*-shim',
      '**/*.css',
      '**/*.scss',
      '**/*.sass',
      '**/*.less',
      '**/*.styl',
    ],
  }],
}