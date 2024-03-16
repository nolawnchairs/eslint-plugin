
# @nolawnchairs/no-iife

This rule disallows the use of immediately invoked function expressions (IIFE). These constructs are ugly, hard to read, and are vestiges of old JavaScript patterns and block scope. It's tempting to use them when calling an async function from the module's top-level in projects not using the more modern ESM syntax with top-level await, but there are more elegant ways to handle this.

IIFE's can also cause issues with surrounding code where semi-colons are omitted:

```ts
// This will throw a syntax error, as the IIFE is interpreted 
// as a function call using the literal "1" as an argument
const x = 1

(function() {
  console.log(x)
})()

// To avoid this, you would need to add a semicolon before the IIFE,
// which adds more visual noise to the code, especially if semi-colons
// are not used consistently
const x = 1

;(function() {
  console.log(x)
})()

```

This rule can be auto-fixed by converting the IIFE to a named function declaration and calling it immediately after. Arrow functions and anonymous functions will be given the name `autoFixedFn`, otherwise the original function name will be retained.

```ts
(() => {
  console.log('Hello, Newman')
})()


### 👎 Invalid
```ts
(() => {
  console.log('Hello, Newman')
})()
```
```ts
(function() {
  console.log('Hello, Newman')
})()
```
```ts
(async function foo() {
  const x = await Promise.resolve('Hello, Newman')
  console.log(x)
})()
```

### 👍 Valid
```ts   
function foo() {
  console.log('Hello, Newman')
}

foo()
```
```ts
const foo = () => {
  console.log('Hello, Newman')
}

foo()
```
```ts
async function foo() {
  const x = await Promise.resolve('Hello, Newman')
  console.log(x)
}

foo()
```

## Config

The rule takes no arguments.

```js
{
  '@nolawnchairs/no-iife': 'error' 
}
```