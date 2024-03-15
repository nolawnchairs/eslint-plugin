
# eslint-rule-import-order

This is a standalone rule for ESLint that enforces a consistent and opinionated order for import statements in TypeScript or JavaScript modules.

This library contains only the rule itself, and is not a plugin. This means that you either need to add the rule to your ESLint configuration manually, or add it as a plugin to your own, custom ESLint plugin.


## Standard Configuration



If you're using the `@nolawnchairs/eslint-plugin` package, this rule is included by default, and can be added to your project's `.eslintrc.js` file:

```js
module.exports = {
  plugins: [
    '@nolawnchairs/eslint-plugin',
  ],
  rules: {
    '@nolawnchairs/import-order': 'error',
    // Or, with configuration
    '@nolawnchairs/import-order': ['error', {
      internalAliasPattern: '@app/**/*',
      internalModulePattern: 'src/**/*',
    }],
  },
}
```

## Plugin Configuration

If you're adding this rule to your own, custom ESLint plugin, first install the rule as a dependency:

```sh
npm install @nolawnchairs/eslint-rule-import-order
```

Then require the rule in your plugin's configuration as you would any other ESLint rule you're adding. Since this rule is standalone and not part of a plugin, you'll need to add it to your plugin's configuration manually:

```js
module.exports = {
  rules: {
    'import-order': require('@nolawnchairs/eslint-rule-import-order'),
  },
}
```
The rule will then be a part of your plugin, and will be prefixed with your plugin's name when used in a project's `.eslintrc.js` file.

```js
module.exports = {
  plugins: [
    '@my-organization/eslint-plugin',
  ],
  rules: {
    '@my-organization/import-order': 'error',
    // Or, with configuration
    '@my-organization/import-order': ['error', {
      internalAliasPattern: '@app/**/*',
      internalModulePattern: 'src/**/*',
    }],
  },
}
```

## Manual Configuration

If you just wish to use this rule in your project without adding it to a plugin, you can add it to your project's `.eslintrc.js` file manually:

```js
module.exports = {
  rules: {
    'import-order': require('@nolawnchairs/eslint-rule-import-order'),
  },
}
```

> **Note:** If using the rule manually, your ESLint configuration file must be a JavaScript file, and not a JSON or YAML file, since you can't import modules in JSON or YAML.

## Usage

This is an opinionated rule that enforces a standardized order for import statements. When parsing your import statements, the rule will categorize each import into one of the following groups:


| Group | Description | Examples |
| --- | --- | --- |
| `core` | Imports from Node.js core modules | `fs`, `path`, `http` |
| `external` | Imports from external libraries | `express`, `axios` |
| `scoped` | Imports from scoped packages | `@nestjs/common`, `@nestjs/core` |
| `aliased` | Internal modules aliased by the user | `@app/my-service`, `@lib/my-service`, `@utils/strings` |
| `internal` | Internal modules not aliased by the user | `src/my-service`, `src/util/strings` |
| `parent` | Parent modules | `../`, `../../` |
| `sibling` | Sibling modules | `./my-service`, `./util/strings` |
| `index` | Index modules | `./index` |
| `unknown` | Modules whose provenance cannot be discerned |  |

The rule will group each import into one of these categories, and then enforce a consistent order for each group. The ordering is as follows:

  1. `core`
  2. `external`
  3. `scoped`
  4. `aliased`
  5. `internal`
  6. `parent`
  7. `sibling`
  8. `index`
  9. `unknown`

Within each group, the rule will enforce a consistent order based on decreasing path depth, and alphabetic order. For example, the following imports:

```ts
import { Injectable } from '@nestjs/common'
import { join } from 'path'
import fs from 'fs'
import { MyService1 } from '@app/some-module'
import { SubModule1 } from '@app/some-module/sub-module'
import { MyService2 } from 'src/my-service'
import { MyService5 } from './index'
import { MyService3 } from './my-service'
import { HttpService } from '@nestjs/axios'
import { MyService4 } from '../my-service'
```

The rule will enforce the following order:

```ts
import fs from 'fs'
import { join } from 'path'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { SubModule1 } from '@app/some-module/sub-module'
import { MyService1 } from '@app/some-module'
import { MyService2 } from 'src/my-service'
import { MyService3 } from './my-service'
import { MyService4 } from '../my-service'
import { MyService5 } from './index'
```

## Configuration

The rule can be configured with the following options:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `internalAliasPattern` | `string` | No | A glob pattern that matches imports against your project's module-alias configuration and groups them in `aliased` |
| `internalModulePattern` | `string` | No | A glob pattern that matches imports against a configured directory prefix and groups them in `internal` |


### Notes on module aliasing and anti-patterns

The `internalAliasPattern` setting assumes a single alias pattern to refer to your source root, e.g. `@app/**/*` or `@lib/**/*`. If you've configured the `paths` setting in your `tsconfig.json` to have multiple aliases referencing different directories relative to your project root, you'll need to condense them into a single pattern to use this rule properly. For example:

Given the following structure:

```
/
├── src/
│   ├── thing.ts
│   └── index.ts
├── components/
│   ├── Button.tsx
│   └── Navbar.tsx
├── utils/
│   ├── request.ts
│   └── string.utils.ts
├── tsconfig.json
└── package.json
```

Using multiple path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@app/*": ["src/*"],
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```
Can be changed to a single path alias, `@app/**/*`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@app/src/*": ["src/*"],
      "@app/components/*": ["components/*"],
      "@app/utils/*": ["utils/*"]
    }
  }
}
```
However, this can be difficult to maintain, so it's recommended to use a single alias pattern if possible. The simple solution would be to use the simple at-slash pattern that points to whatever project directory functions as source-root, e.g. `@/*`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

We recommend having all files in your project to live under the same directory, such as `src`, and using a single alias pattern, e.g. `@app/**/*`. This will make it easier to maintain and understand your project's structure:
  
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@app/*": ["src/*"]
    }
  }
}
```
