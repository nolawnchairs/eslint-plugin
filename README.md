
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

* [application](./src/application/README.md) - ESLint configuration designed for applications.
* [library](./src/library/README.md) - ESLint configuration designed for libraries.


## Rules

* [import-order](./src/import-order/README.md) - Enforces a standardized, opinionated order for import statements.
