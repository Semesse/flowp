# flowp

![](https://img.shields.io/github/workflow/status/Semesse/flowp/Build,%20Test%20and%20Lint/master?style=flat-square)
![](https://img.shields.io/codeclimate/maintainability/Semesse/flowp?style=flat-square)
![](https://img.shields.io/codeclimate/coverage/Semesse/flowp?style=flat-square)

CJS and ESM are both supported; require node.js 16+, latest bun or a transpiler

flowp is a promise-based utility library, providing asynchronous components like


- **[Future](./docs/Future.md)**: {@stable} Promise that can be resolved anywhere other than where it's defined
- **[Semaphore](./docs/Semaphore.md) / [Mutex](./docs/Mutex.md)**: controls max concurrency
- **[Channel](./docs/Channel.md)**: multi producer single consumer channel, includes utilities like ChannelHub
- **[lateinit](./docs/Exports.md)**: delegate method calls and property accesses to the fulfilled value of Promises
- a bunch of features are under development 🚧  
  there will be a refactor recently

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
return client.then(c => c.something)
(await client).fetchI18nTexts(navigator.locale)

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

### Contribute

Feedback & PRs are welcomed 🥰

### License

MIT © [@Semesse](https://github.com/Semesse)
