<p align="center"><img src="./assets/flowp.svg" width="128" height="128"/></p>

![CI](https://img.shields.io/github/workflow/status/Semesse/flowp/Build,%20Test%20and%20Lint/master?style=flat-square)
![Maintainability](https://img.shields.io/codeclimate/maintainability/Semesse/flowp?style=flat-square)
![Coverage](https://img.shields.io/codeclimate/coverage/Semesse/flowp?style=flat-square)
![Test Cases](https://img.shields.io/badge/Test%20Cases-93-brightgreen?style=flat-square)
![ES2020](https://img.shields.io/badge/ECMAScript-2020-brightgreen?style=flat-square)
![Downloads](https://img.shields.io/npm/dm/flowp?style=flat-square)

flowp aims to provide promise based utilities with modern and simple interface.

- 📦 Pure TypeScript and ready to run in Node.js, browsers and web workers

- 🏙 Embrace promises and async/await syntax, no more callback hells

- 🧱 Robust quality with tests focusing on coverage as well as race conditions

- 🔰 Friendly documentation and examples

## Documentation

Checkout the official documentation, API references and tutorials at [https://flowp.pages.dev](https://flowp.pages.dev), everything is there!

- **[Future](https://flowp.pages.dev/docs/tutorial/future/)**: a resolve-later promise
```typescript
class MyServer {
  public ready = new Future<void>()
  private server!: HttpServer
  constructor() {
    this.ready = this.initServer()
  }
  initServer() {
    this.server = http.listen(8080, this.ready.resolve)
  }
  foo() {
    await this.ready
    this.server // safely access server
  }
}

const server = new MyServer()
await server.ready
```
- **[Progress](https://flowp.pages.dev/docs/tutorial/progress)**: promise with progress reporting
```typescript
const progress = new Progress<string, { current: number; total: number }>({ current: 0, total: 100 })

// automatically resolve when all tasks are finished
progress.onProgress((p) => p.current >= p.total && progress.resolve('banana!'))

progress.report({ current: 15, total: 100 })
progress.report({ current: 100, total: 100 })

expect(await progress).toBe('banana!')
```
- **[Channel](https://flowp.pages.dev/docs/tutorial/channel/overview/)**: send and receive messages with a buffered channel
```typescript
class EventChannel<T> {
  private hub: ChannelHub<T>
  constructor(){ this.hub = new ChannelHub<T>() }
  event(handler: (v: T) => any) {
    const reader = this.hub.reader()
    reader.pipe(pipe.to(handler))
    return () => reader.unpipe()
  }
  fire(v: T) { this.hub.broadcast(v) }
}
```
- **[Semaphore](https://flowp.pages.dev/docs/tutorial/semaphore/overview/)**: restrict concurrent access to resource
```typescript
// maximum of 16 concurrent requests
const sem = new Semaphore(16)

const download = async (url: string) => {
  // some download logic
  console.log(url)
  return timers.sleep(1000)
}
const urls: string[] = Array.from({ length: 100 }, (_, i) => (i + 1).toString())

// automatically schedule download
await Promise.all(urls.map((url) => sem.schedule(() => download(url))))



const mutex = new Mutex({ a: 1 })
const { release, value } = await mutex.lock()
const ref = value // value is a temporary reference which does not equal the value stores in mutex
ref.a // => 1
release()
ref.a // => TypeError, temporary reference destroyed
```
- **[delegate](https://flowp.pages.dev/docs/tutorial/future/)**: delegate property access and method calls to promise resolved value
```typescript
const fs = import('fs')

await fs.$promises.$writeFile('hello.ts', `export default () => 'hello world!'`)
```

## CJS & ESM support

CJS is supported with [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) and by default, the main entry points to `cjs`.

If your environment supports ESM, which is preferred, you can use `import { Future } from 'flowp/future' to import on demand without a tree shaker (like webpack).


### Contribute

Feature requests, issues & PRs are welcomed 🥰

### License

MIT © [@Semesse](https://github.com/Semesse)
