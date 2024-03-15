
# @nolawnchairs/prefer-aliased

Enforce internal application imports to be aliased with a token instead of relative paths.


### 👎 Invalid
```ts
import { foo } from '../foo'
import { bar } from './bar'
import { baz } from './bar/baz'
```

### 👍 Valid
```ts
import { foo } from '@app/foo'
import { bar } from '@app/bar'
import { baz } from '@app/bar/baz'
```

## Config

The rule accepts one argument, which is a an object with `alias` key and an object value containing key/value pairs of alias tokens to the path from which they are aliased. The default is `{ alias: { '@app': 'src' } }`. 

We strongly recommend you only use a single alias token for your source root, as this can also affect import ordering. See [import-order](../import-order/README.md#notes-on-module-aliasing-and-anti-patterns) for more information.

```ts
{
  'prefer-aliased': [
    'error', 
    {
      alias: {
        '@app': 'src',
      }
    },
  ] 
}
```
