---
sidebar_position: 3
title: Examples & Use Cases
description: Semaphore & Mutex Examples
---
import TOCInline from '@theme/TOCInline'
import { PlaygroundBadge } from '@site/src/theme/playground'
import FlowP from '@site/src/theme/flowp'

<TOCInline toc={toc} />

## Asynchronous Safety

<p><PlaygroundBadge path="semaphore/async-safety.ts" /></p>

Writing a long async function can be error-prone —— whenever you use `await`, previous assertions may be stale, and variables may have changed before your task have finished.

```typescript title="semaphore/async-safety.ts"
import { timers } from 'flowp'
let v: any[] = []
const longasync = async () => {
  if (v.length !== 0) return // v must be empty
  await timers.sleep(1000) // some expensive task
  v.push('world') // since v is empty we can "safely" assume v.length to be 1
  console.log(v) // but this actually logs [hello, world], who touched my cheese?
}

longasync()
v.push('hello')

/* and typescript's type narrowing won't tell you */
let s: string | number

const b = async (): string => {
    if(typeof s === 'number') return
    await new Promise<void>((r) => {
        s = 123456
        r()
    })
    // typeof s === number but in TS it's string
    // no error will be thrown
    return s
}
```

These bugs are really hard to reproduce and capture, but why don't we write code that forbids such race conditions?

```typescript
let v: any[] = []
const mut = new Mutex()
const longasync = async () => {
  if (v.length !== 0) return
  await timers.sleep(1000)
  v.push('world')
  console.log(v) // logs ['world'], all as expected!
}

mut.schedule(longasync)
mut.schedule(() => v.push('hello'))
```

## Concurrency Limit

The most common usage of semaphores in JavaScript is possibly to limit parallel tasks such as requests.
It's simple to restrict concurrent requests using <FlowP/>

<p><PlaygroundBadge path="semaphore/concurrency.ts" /></p>

```typescript title="semaphore/concurrency.ts"
import { Semaphore, timers } from 'flowp'

// maximum of 16 concurrent requests
const sem = new Semaphore(16)

const downloadNpmTar = async (url: string) => {
  // some download logic
  console.log(url)
  return timers.sleep(1000)
}
const urls: string[] = Array.from({ length: 100 }, (_, i) => (i + 1).toString())

// automatically schedule download
await Promise.all(urls.map((url) => sem.schedule(() => downloadNpmTar(url))))
```

## Count Down

If you don't release the semaphore, it becomes a simple counter. Upon permits drained, the semaphore cannot be acquired anymore and isFull will always be true.

It can also be a mutex if some logic only runs once during thw whole app lifecycle:

<p><PlaygroundBadge path="semaphore/notify-once.ts" /></p>

```typescript title="semaphore/notify-once.ts"
import { Mutex } from 'flowp'
import inquirer from 'inquirer'

const notificationLock = new Mutex()

// notify the user there's an update
const notifyUpdate = async () => {
  // prevent memory leak since lock might not be released
  if (!notificationLock.canLock) return

  // there should only be one notification at the same time
  const release = await notificationLock.lock()

  // prompt user and wait for action
  // here we use cli prompt to demonstrate this case
  const ans = await inquirer.prompt({
    type: 'confirm',
    name: 'update',
    message: 'update available',
  })
  if (ans.update) {
    // do update logic
    release()
  } else {
    // never release, we don't prompt again during this run
  }
}

// check for updates and notify the user
setInterval(notifyUpdate, 1000)
```
