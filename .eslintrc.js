module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.local.json',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  ignorePatterns: ['.eslintrc.js'],
  // TODO: Add rules, including this one once it's in a plugin
}