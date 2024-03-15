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
    '@nolawnchairs/import-order': ['error', {
      internalAliasPattern: '@lib/**/*',
    }],
    '@nolawnchairs/prefer-aliased': ['error', {
      alias: {
        '@lib': 'src',
      },
    }],
  },
}
