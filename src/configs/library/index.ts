
import common from '../common'
import plugins from '../plugins'

export const application = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins,
  rules: {
    ...common,
    '@nolawnchairs/import-order': 'error',
  },
  overrides: [
    {
      files: ['**/.*.cjs', '**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        'import/no-commonjs': 'off',
      },
    },
  ],
}
