
# @nolawnchairs/no-import-gaps

This rule enforces the absencse of newlines between import statements.

### 👎 Invalid
```ts
import foo from 'foo'
import bar from 'bar'

import baz from 'baz'

console.log('Hello, Newman')
```

### 👍 Valid
```ts   
import foo from 'foo'
import bar from 'bar'
import baz from 'baz'

console.log('Hello, Newman')
```

## Config

The rule takes no arguments.

```ts
{
  '@nolawnchairs/no-import-gaps': 'error'
}
```