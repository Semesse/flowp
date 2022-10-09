<p align="center"><img src="./assets/flowp.svg" width="128" height="128"/></p>

![CI](https://img.shields.io/github/workflow/status/Semesse/flowp/Build,%20Test%20and%20Lint/master?style=flat-square)
![Maintainability](https://img.shields.io/codeclimate/maintainability/Semesse/flowp?style=flat-square)
![Coverage](https://img.shields.io/codeclimate/coverage/Semesse/flowp?style=flat-square)
![Test Cases](https://img.shields.io/badge/Test%20Cases-89-green?style=flat-square)
![Downloads](https://img.shields.io/npm/dm/flowp?style=flat-square)

flowp aims to provide promise based utilities with modern and simple interface.

- 📦 Pure TypeScript and ready to run in Node.js, browsers and web workers

- 🏙 Embrace promises and async/await syntax, no more callback hells

- 🧱 Robust quality with tests focusing on coverage as well as race conditions

- 🔰 Friendly documentation and examples

## Documentation

Checkout the official documentation, API references and tutorials at [https://flowp.pages.dev](https://flowp.pages.dev), everything is there!

- **[Future](https://flowp.pages.dev/docs/tutorial/future/)**: a resolve-later promise
- **[Progress](https://flowp.pages.dev/docs/tutorial/progress)**: promise with progress reporting
- **[Channel](https://flowp.pages.dev/docs/tutorial/channel/overview/)**: send and receive messages with a buffered channel
- **[Semaphore](https://flowp.pages.dev/docs/tutorial/semaphore/overview/)**: restrict concurrent access to resource
- **[delegate](https://flowp.pages.dev/docs/tutorial/future/)**: delegate property access and method calls to promise resolved value

## CJS & ESM support

CJS is supported with [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) and by default, the main entry points to `cjs`.

If your environment supports ESM, which is preferred, you can use `import { Future } from 'flowp/future' to import on demand without a tree shaker (like webpack).


### Contribute

Feature requests, issues & PRs are welcomed 🥰

### License

MIT © [@Semesse](https://github.com/Semesse)
