
# @nolawnchairs/first-newline

This rule enforces having exactly one newline at the beginning of a file before the first import. This is purely for aesthetic reasons, as it makes the file easier to read by giving it some padding. Newlines at the end of the file are governed by the `eol-last` rule which should be configured separately.

### 👎 Invalid
```ts
1   import foo from 'foo'
2   import bar from 'bar'
```

### 👍 Valid
```ts
1   
2   import foo from 'foo'
3   import bar from 'bar'
```

## Config

The rule accepts one argument:

- `always` (default) - requires a newline at the beginning of the file
- `never` - disallows a newline at the beginning of the file

```ts
{
  '@nolawnchairs/first-newline': [
    'error', 
    'always',
  ] 
}
```
## When the first line cannot be empty

Some files require the first line to hold data, such as a binary script:

```ts
#!/usr/bin/env node

console.log('Hello, Newman')
```

Or with a string directive such as `"use strict"`:

```ts
'use strict'

console.log('Hello, Newman')
```

This rule accounts for these cases and will forbid a beginning newline and will **always** require a newline after the first line, regardless of the configuration.
