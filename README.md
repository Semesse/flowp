# flowp

![](https://img.shields.io/github/workflow/status/Semesse/flowp/Run%20tests/master?label=CI&style=flat-square)
![](https://img.shields.io/codeclimate/maintainability/Semesse/flowp?style=flat-square)
![](https://img.shields.io/codeclimate/coverage/Semesse/flowp?style=flat-square)

CJS and ESM are both supported, requires node.js 16+ or a transpiler

flowp is a promise based utility library, providing asynchronous components like


- **[Semaphore](./docs/Semaphore.md) / [Mutex](./docs/Mutex.md)**: controls max concurrency
- **[Channel](./docs/Channel.md)**: multi producer single consumer channel
- **[Future](./docs/Future.md)**: Promise that can be resolved anywhere other than where it's defined
- **[lateinit](./docs/Exports.md)**: delegate method calls and property accesses to the fulfilled value of Promises

### Have a quick look

**[Future](./docs/Future.md)** can be used as a promise, but you can resolve it anywhere, especially useful in tasks like EventEmitter or on other occasions you don't know what to execute immediately in the promise constructor
```typescript
const waitUntilNextEvent = () => {
  const e = new EventEmitter()
  const f = new Future<Event>()
  e.on('event', f.resolve.bind(f))
  return f
}
```

**[lateinit](./docs/Exports.md)** some configurations are initialized asynchronously, and you may need to await it every time before using it. With `lateinit` you can just call methods and get properties with prefix `$` and you'll get a new promise representing this action

```typescript
export const client = initClient()
// you need to await to use the client every time
return client.then(c => c.something)
(await client).fetchI18nTexts(navigator.locale)

// with lateinit, you can access the result directly like it's not a promise
export const client = lateinit(initClient())
return client.$fetchI18nTexts(navigator.locale)
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

Feedback & PRs are welcomed🥰

### License

MIT © [@Semesse](https://github.com/Semesse)
