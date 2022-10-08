---
sidebar_position: 1
title: Future
description: Overview of Future's features
---

import FlowP from '@site/src/theme/flowp'

## Overview

> <i>A promising future, though it may never come.</i>

Sometimes you may need to create a promise but resolve it later in other places. Unfortunately `Promise` constructor only accepts callbacks and you need to manually hold a reference to `resolve` or `reject` like this:

```typescript
class Deferred<T> {
  public promise: Promise<T>
  private _resolve!: (value: T) => void

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
    })
  }

  resolve(value: T): void {
    this._resolve(value)
  }
}

let resolver
const promise = new Promise((resolve) => {
  resolver = resolve
})
```

This is not an individual case. The pattern widely exists amongst JavaScript projects, even the most well-known ones including npm ([in test codes](https://cs.github.com/npm/cli/blob/c383564213c709aa9d82aeb21333516fc78d5165/test/lib/utils/pulse-till-done.js#L17)), [electron](https://cs.github.com/electron/electron/blob/e0fb5cbe1fd84d9651e6030ebab683dd9e4af42d/spec/api-protocol-spec.ts#L60), [webpack](https://cs.github.com/webpack/webpack/blob/9fcaa243573005d6fdece9a3f8d89a0e8b399613/lib/hmr/LazyCompilationPlugin.js#L257) and vscode ([here](https://cs.github.com/microsoft/vscode/blob/5a9675ec6bce0905703a7f839dec0fef3ee41cd4/src/vs/platform/remote/electron-sandbox/remoteAuthorityResolverService.ts?q=_resolve#L15) and [here](https://cs.github.com/microsoft/vscode/blob/ba8636b3c9da64eac1f3b8752a7ee282dd127d17/src/vs/workbench/services/extensions/common/abstractExtensionService.ts#L68)).

With [Future](#future), you only write

```typescript
import { Future, timers } from 'flowp'

const future = new Future<string>()

fetch('https://example.com').then(() => future.resolve('voila! 🐳'))
timers.sleep(() => future.reject(new Error('whoops, timed out XD')), 1000)

const result = await future
```

<FlowP /> itself is powered by Futures and you can refer to its source code to see how it can be used. And futures are real promises, so the following statements are true:

- `future instanceof Promise`
- `future.then()` returns a normal Promise
- `Promise.prototype.then` can be called with a future

:::note
Futures will _not_ prevent a node.js program from exiting because it's not executing any code. It does not create an "open handle", but you can await a future at top level.
:::

## Class

```typescript
class Future<T = unknown> extends Promise<T>
```

Where:

`T`: type of its fulfilled value, defaults to unknown

`Promise<T>`: Future inherits all methods and properties from JavaScripts's native Promise

## Properties

### pending

```typescript
get pending(): boolean
```

Check if future is neither fulfilled nor rejected. 

### fulfilled

```typescript
get fulfilled(): boolean
```

Check if future has been fullfilled.

### rejected

```typescript
get rejected(): boolean
```

Check if future has been rejected. 

## Methods

### constructor

```typescript
constructor()
```

Constructs a new Future, no parameters are required.

### resolve

```typescript
get resolve(): (value: T | PromiseLike<T>) => void
```

Resolves the promise with given value. Passing an `PromiseLike` fulfills it with resolved value, the same way as `Promise.prototype.then`.

It is actually a getter that returns a `bound` version of resolver so `future.resolve.bind(future)` is not required. Another rationale is that `resolve` does not exist on the class level, but belongs to each future instance

### reject

```typescript
get reject(): (error?: unknown) => void
```
reject the future with given value.

the method has already bound to `this`, so you can write `emitter.on('error', future.reject)`

:::tip
`UnhandledRejection` will be automatically consumed if `reject` is called before adding a `.catch` handler. You can safely use this without adding a explicit handler.
:::