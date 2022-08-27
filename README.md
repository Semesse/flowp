<p align="center"><img src="./assets/flowp.svg" width="128" height="128"/></p>

![CI](https://img.shields.io/github/workflow/status/Semesse/flowp/Build,%20Test%20and%20Lint/master?style=flat-square)
![Maintainability](https://img.shields.io/codeclimate/maintainability/Semesse/flowp?style=flat-square)
![Coverage](https://img.shields.io/codeclimate/coverage/Semesse/flowp?style=flat-square)
![Downloads](https://img.shields.io/npm/dw/flowp?style=flat-square)

> ✳️ CJS and ESM are both supported
>
> 📦 Zero dependency & written in pure TypeScript
>
> 🏙 Targeting ES2020 and can be run directly on Node.js 16+, or with a transpiler (babel, esbuild, swc, etc.)

flowp is a promise-based utility library, providing asynchronous API styled utilities like

- **[Future](./docs/Future.md)**: {@stable} Promise that can be resolved anywhere other than where it's defined
- **[Semaphore](./docs/Semaphore.md) / [Mutex](./docs/Mutex.md)**: controls max concurrency
- **[Channel](./docs/Channel.md)**: multi producer single consumer channel
- **[lateinit](./docs/Exports.md)**: delegate method calls and property accesses to the fulfilled value of Promises
- a bunch of features are under development 🚧

### Have a quick look

**[Future](./docs/Future.md)** can be used as a promise, but you can resolve it anywhere, especially useful in tasks like EventEmitter or on other occasions you don't know what to execute immediately in the promise constructor

```typescript
const waitUntilNextEvent = () => {
  const e = new EventEmitter()
  const f = new Future<Event>()
  e.on('event', f.resolve)
  return f
}
// or
class MyClass {
  constructor() {
    this.ready = new Future()
  }
  // called by other processes
  init() {
    this.ready.resolve()
  }
}
```

**[lateinit](./docs/Exports.md)** pretty like the [wavy dot proposal](https://github.com/tc39/proposal-wavy-dot), some configurations are initialized asynchronously, and you may need to await it every time before using it. With `lateinit` you can just call methods and get properties with the prefix `$` and you'll get a new promise representing this action

```typescript
export const client = initClient()
// you need to await to use the client every time
return client
  .then((c) => c.something)(await client)
  .fetchI18nTexts(navigator.locale)

// with lateinit, you can access the result directly like it's not a promise
export const client = lateinit(initClient())
return client.$fetchI18nTexts(navigator.locale).$t('hello')
```

**[Semaphore](./docs/Semaphore.md)** controls max concurrency like how many requests can be started at the same time. Unlike other implementations, you can change the capacity by `grant` or `revoke`

```typescript
const sem = new Semaphore(concurrency)
const release = await sem.acquire()
// do something...
release()
sem.grant()
await sem.revoke()
```

**[Mutex](./docs/Mutex.md)** specialized semaphore with maximum concurrency of 1

```typescript
const mutex = new Mutex()
const release = await mutex.acquire()
// do something...
release()
```

**[Channel](./docs/Channel.md)** message queue!

```typescript
import { pipe } from 'flowp'
const ch = new Channel(10) // can have at most 10 items in queuq
await ch.send('hello')
// on the other side
await ch.receive()
// or use async iterator
for await (const el of ch.stream()) {
  console.log(el)
}
// or pipe to other place
ch.pipe(pipe.to.console())
ch.pipe(pipe.to((e) => logger.error(e)))
ch.pipe(ch2)
```

### Contribute

Feature requests, issues & PRs are welcomed 🥰

### License

MIT © [@Semesse](https://github.com/Semesse)
