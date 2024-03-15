const { default: rules } = require('./lib/configs/common')

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: 'tsconfig.lint.json',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'unused-imports',
  ],
  rules,
  overrides: [
    {
      files: ['src/**/*.ts'],
      rules: {
        // Do as I say, not as I do
        'import/no-default-export': 'off',
      },
    },
  ],
}
