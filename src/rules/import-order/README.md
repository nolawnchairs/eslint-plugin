
# @nolawnchairs/import-order

This rule enforces a consistent and opinionated order for import statements in TypeScript or JavaScript modules. It was created to address some of the shortcomings of the `import/order` rule.

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

## Usage

This is an opinionated rule that enforces a standardized order for import statements. When parsing your import statements, the rule will categorize each import into one of the following groups:


| Group | Description | Examples |
| --- | --- | --- |
| `core` | Imports from Node.js core modules | `fs`, `path`, `http` |
| `external` | Imports from external libraries | `express`, `axios` |
| `scoped` | Imports from scoped packages | `@nestjs/common`, `@nestjs/core` |
| `aliased` | Internal modules aliased by the user | `@app/my-service`, `@lib/my-service`, `@utils/strings` |
| `internal` | Internal modules not aliased by the user | `src/my-service`, `src/util/strings` |
| `parent` | Parent modules | `../my-service`, `../../my-service` |
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

Within each group, the rule will enforce a consistent order based on decreasing path depth, and alphabetic order. 

### 👎 Invalid
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

### 👍 Valid
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

Module aliasing is recommended for application code, as it keeps your import list clean and easy to read. However, it's important to use module aliasing judiciously, as it can lead to anti-patterns and make your codebase difficult to maintain.

The `internalAliasPattern` setting assumes a single alias pattern to refer to your source root, such as `@app/**/*`. If you've configured the `paths` setting in your `tsconfig.json` to have multiple aliases referencing different directories relative to your project root, you'll need to condense them into a single pattern to use this rule properly. For example:

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

Using multiple path aliases in `tsconfig.json`, whilst valid, does not play well with this rule. Thus, the following configuration:

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
Can be changed to a single path alias, `@app/**/*` by prefixing:

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
However, this can be difficult to maintain. If your project requires multiple directories to host application code (or if a refactor is impractical), it's recommended to use a single alias pattern of `@/*` that points to your project root. This will allow any file in your project to be aliased with a single token.

Set the `internalAliasPattern` to `@/**/*`, and set your paths config as follows:

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

## Recommended configuration

We recommend having all files in your project to live under the same directory, such as `src`, and using a single alias pattern.

Set the `internalAliasPattern` to `@app/**/*`, and set your paths config as follows:
  
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
