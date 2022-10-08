---
sidebar_position: 1
title: Usage & Examples
description: Examples of how to use Future
---

import TOCInline from '@theme/TOCInline'
import { PlaygroundBadge } from '@site/src/theme/playground'
import FlowP from '@site/src/theme/flowp'

<TOCInline toc={toc} />

## Barrier

<p><PlaygroundBadge path="future/barrier.ts" /></p>

Some functions should only be called after certain conditions have been met, like "collect usage data on user's consent", "write cookie only if user accepted", or "action is available after some components are loaded".
You can discard or wait (be careful of memory leak) before the future is resolved, according to your requirements.

```typescript
import { Future, timers } from 'flowp'
import inquirer from 'inquirer'

const barrier = new Future<void>()

inquirer
  .prompt({
    type: 'confirm',
    name: 'usage',
    message:
      'Share usage data to us anonymously to help us build better tools?',
  })
  .then((ans) => {
    if (ans.usage) barrier.resolve()
  })
  .catch(console.error)

function collectUsageData() {
  // discard if user has not agreed
  if (barrier.fulfilled) {
    console.log('usage data collected')
  } else {
    console.log('data not collected')
  }
}
```
 
## CountDownLatch

<p><PlaygroundBadge path="future/count-down-latch.ts" /></p>

Similar to Java's [CountDownLatch](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/CountDownLatch.html), which resolves after counting to zero.

```typescript
import { Future, Semaphore, timers } from 'flowp'

class CountDownLatch {
  private done = new Future<void>()
  constructor(public count: number) {}
  async countDown() {
    this.count--
    if (this.count === 0) this.done.resolve()
  }
  async wait() {
    await this.done
  }
}

const latch = new CountDownLatch(5)
const task = async (i: number) => {
  console.log(`task ${i} started`)
  await timers.sleep(i * 1000)
  console.log(`task ${i} partially finished`)
  latch.countDown()
  await timers.sleep(i * 1000)
  console.log(`task ${i} finished`)
}
const tasks = Array.from({ length: 5 }, (_, i) => task(i))
latch.wait().then(() => console.log('latch done'))
Promise.all(tasks).then(() => console.log('all done'))
```