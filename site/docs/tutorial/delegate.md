---
sidebar_position: 5
title: delegate
description: Overview of Future's features
---

import FlowP from '@site/src/theme/flowp'

# delegate

## Use cases

It's quite common that a value is lazy calculated or an object is initialized asynchronously. In this case, [delegate](#delegate) will help you by delegating property access and method calls to a promise's resolved value.
For example, an `i18n` dynamically loads texts according to language, and it provides translation only after texts are loaded.

```typescript
class I18n {
  async init() {
    this.load(await import(`./i18n/${language}.json`)) // lazy loads the all texts
    return this
  }
}
const i18n: Promise<I18n> = new I18n().init()
(await i18n).t('some text')

// using delegate
delegate(new I18n().init())
await i18n.$t('some text')
```
See [examples](#examples) for more detailed usages.

## Signature

```typescript
function delegate<T extends Promise<unknown>>(value: T): Delegated<T>
```
Where:
```typescript
// for all properties in T, create a corresponding $prop property and 
type Delegated<T> = {
  readonly [K in keyof Awaited<T> & string as `$${K}`]: Awaited<T>[K] extends Callable
    ? (...args: Parameters<Awaited<T>[K]>) => ReturnType<Awaited<T>[K]>
    : Delegated<Awaited<T>[K]>
} & Promise<Awaited<T>>
```

Delegates method calls and member access to the resolved value, and this is type safe! You can access delegated properties with `$key`, e.g. `(await arr).map()` => `arr.$map` and the [delegated object](#) behaves like a normal promise so to retrive the resolved value at any level just use `.then()` or `await`

`delegate` recursively delegate the promise, every `$key` will return a Proxied object and `await delegated.$a.$b` is valid

`@param value` value to delegate to, must be a promise and not be resolved with primitives

`@returns` the delegated object, it has properties that normal `Promise`s have (`then`, `catch`, `finally`), and delegated properties that starts with `$`.

It simulates the [weavy dot proposal](https://github.com/tc39/proposal-wavy-dot) but syntax is a bit different.

| Weavy Dot Syntax | delegate |
| --- | --- |
| `p~.name` | `p.$name` |
| `p~.[prop]` | ``p[`$${prop}`]`` |
| `p~.(...args)` | `p(...args)` or `p.$call(null, ...args)` |
| `p~.name(...args)` | `p.$name(...args)`|
| `p~.[prop](...args)` | ``p.[`$${name}`](...args)``|

:::note
Currently only `get` and `apply` proxy traps are implemented.

`set`, `deleteProperty`, `defineProperty`, mutates the result so they won't be supported, `has`, `ownKeys`, `hasOwnProperty` and `getOwnPropertyDescriptor` is not available because the function don't know any information about the resolved value.

It returns a proxy trapping a no-op function to make returned value able to be invoked so these traps will fall into Function.
:::

## Examples

