
# @nolawnchairs/empty-brackets

This is a formatting rule that enforces a single space in empty object and array literals. Empty object and array literals spanning multuple lines will be compacted onto the declaration line with spaces inserted or removed as defined by the rule configuration.

### 👎 Invalid
```ts
/* @nolawnchairs/empty-brackets: ['error', { array: false, object: true }] (default settings) */
const foo = [ ]
const bar = {}
const baz = {
}
const qux = [


]

/* @nolawnchairs/empty-brackets: ['error', { array: true, object: false }] */
const foo = []
const bar = { }
const baz = {

}
const qux = [
]

/* @nolawnchairs/empty-brackets: ['error', { array: true, object: true }] */
const foo = []
const bar = {}
const baz = {

}
const qux = [
]
```

### 👍 Valid
```ts   
/* @nolawnchairs/empty-brackets: ['error', { array: false, object: true }] (default settings) */
const foo = []
const bar = { }
const baz = { }
const qux = [ ]

/* @nolawnchairs/empty-brackets: ['error', { array: true, object: false }] */
const foo = [ ]
const bar = {}
const baz = {}
const qux = [ ]

/* @nolawnchairs/empty-brackets: ['error', { array: true, object: true }] */
const foo = [ ]
const bar = { }
const baz = { }
const qux = [ ]

```

## Config

The rule takes an object with the following optional properties:

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `array` | boolean | `false` | Whether to enforce a single space between empty array brackets: `[ ]` |
| `object` | boolean | `true` | Whether to enforce a single space between empty object brackets: `{ }` |

```ts
{
  '@nolawnchairs/empty-brackets': ['error', {
    array: false,
    object: true,
  }]
}
```