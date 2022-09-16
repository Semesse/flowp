---
sidebar_position: 1
title: Introduction
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import CodeBlock from '@theme/CodeBlock'
import FlowP from '@site/src/theme/flowp'

# <h1 className="flowp-color">Intro</h1>

<FlowP /> aims to provide promise based utilities with modern and simple interface.

- 📦 Pure TypeScript and ready to run in Node.js, browsers and web workers

- 🏙 Embrace promises and async/await syntax, no more callback hells

- 🧱 Robust quality with tests focusing on coverage as well as race conditions

- 🔰 Friendly documentation and examples

## Why flowp?

Yet numerous libraries provide similar functionalities, like semaphores (to limit concurrency):

- <a href="https://www.npmjs.com/package/p-limit" title="sindresorhus's doing great work!">
    p-limit{' '}
  </a>
  <img src="https://img.shields.io/npm/dw/p-limit?style=flat-square" style={{ verticalAlign: 'sub' }} />
- <a href="https://www.npmjs.com/package/p-limit" title="sindresorhus's doing great work!">
    semaphore{' '}
  </a>
  <img src="https://img.shields.io/npm/dw/semaphore?style=flat-square" style={{ verticalAlign: 'sub' }} />
- <a href="https://www.npmjs.com/package/p-limit" title="sindresorhus's doing great work!">
    promise-limit{' '}
  </a>
  <img src="https://img.shields.io/npm/dw/promise-limit?style=flat-square" style={{ verticalAlign: 'sub' }} />

But many of them have more or less limitations such as CJS only or lack of some capabilities.
This doesn't mean these are not good libraries,
but there are no single library that meets the author's need, so he's writing himself.

Besides, <FlowP /> adds some extra primitives to make these components easy to use and debug.

## Getting Started

### Prerequisites

This package targets ES2020 (ES11) and requires Node.js v16+ ([Compability table](https://node.green/)) or modern browser ([Compability table](https://caniuse.com/sr_es11)) to run.

- If you're using an transpiler, e.g. babel / esbuild / swc then everything's good 🚀
- If you don't have one, you may need to upgrade your Node.js version or think if you really need to write an IE compatible site 😕

### Installation

Use your favorite package manager to install this package:

<Tabs>
  <TabItem value="npm" label="npm" default>
    <CodeBlock language="bash">npm install --save flowp</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="yarn">
    <CodeBlock language="bash">yarn add flowp</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
    <CodeBlock language="bash">pnpm add flowp</CodeBlock>
  </TabItem>
  <TabItem value="bun" label="bun">
    <CodeBlock language="bash">bun install flowp</CodeBlock>
  </TabItem>
</Tabs>

## Start using flowp

Checkout async components you like or continue reading tutorial.

### Extended promises

Provides functionalities that JavaScript's Promise don't yet have:

- [Future](./future) A promise that can be filled in results anywhere other than its definition
- [Progress](./progress) A promise but with progress report

### Promise helpers

- [timers](api/flowp.timers) Timeout helpers

### Asynchronos control flows

These classes utilize JavaScript's Promise to

- [Semaphore](./semaphore/overview) Controls concurrent access to a common resource
- [Mutex](./semaphore/api#mutex-class) Specialized Semaphore(1)
- [Channel](./channel/overview) Powerful asynchronos message queue
- [ChannelHub](api/flowp.channelhub) Broadcast messages to its every reader Channel

### Experimental blackmagick

These features are not well tested in production environment, use with caution

- [delegate](./delegate) deletgate property access and function calls of a promise, powered by [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
