
# @nolawnchairs/eslint-plugin

This is a collection of custom ESLint rules for personal projects.

## Installation

```bash
npm install -D @nolawnchairs/eslint-plugin
```

## Configuration

To use only the rules provided by this plugin, you can add the following to your ESLint configuration file:

```js
module.exports = {
  plugins: ['@nolawnchairs'],
  rules: {
    '@nolawnchairs/import-order': ['error', { /* options */ }]
  }
}
```

## Extending

This plugin also provides my personal ESLint configuration, which you can extend in your own ESLint configuration file:

```js
module.exports = {
  extends: ['plugin:@nolawnchairs/application']
}
```

### Configs

* [application](./src/configs/application/README.md) - ESLint configuration designed for applications.
* [library](./src/configs/library/README.md) - ESLint configuration designed for libraries.


## Rules

| Rule | Description |
| ---- | ----------- |
| [`@nolawnchairs/first-newline`](./src/rules/first-newline/README.md) | Enforces having exactly one newline at the beginning of a file before the first import. |
| [`@nolawnchairs/import-order`](./src/rules/import-order/README.md) | Enforces a standardized, opinionated order for import statements. |
| [`@nolawnchairs/no-iife`](./src/rules/no-iife/README.md) | Disallows immediately invoked function expressions (IIFE). |
| [`@nolawnchairs/no-import-gaps`](./src/rules/no-import-gaps/README.md) | Enforces the absence of newlines between import statements. |
| [`@nolawnchairs/prefer-aliased`](./src/rules/prefer-aliased/README.md) | Enforce internal application imports to be aliased with a token instead of relative paths. Only recommended for applications and not libraries. |
