---
sidebar_position: 1
description: Overview of Semaphore's features
---

# Overview

Semaphore with async interface, which limits simultaneous access to a resouce. When a resouce is ready, it "signals" the acquirer by resolve the promise returned from [acquire](./api#acquire).

But it's more powerful than any other semaphores, thanks to the extra [grant](./api#grant) | [revoke](./api#revoke)  and [freeze](./api#freeze) | [unfreeze](./api#unfreeze) primitives which will be introduced later.

:::info
Terminology:
- permit: each acquirer is acquiring a `permit` from the semaphore. Once acquired, it executes its own logic before releasing the permit to other acquirers.
:::

## create a semaphore

Constructs a semaphore with given number of permits, which can be later used to limit concurrency. A semaphore may have unlimited number of permits.

```typescript
const sem = new Semaphore(5)
```

## acquire & release

You can acquire a permit from semaphore, and the returned promise won't resolve until the semaphore has remaining permits. Don't forget to release them once you've done. 

There are some synchronos variant available, see [API](./api)

```typescript
const sem = new Semaphore(5)

const tarballs = Promise.all(packages.map(async (package) => {
  const release = await sem.acquire()
  const tarball = await download(package)
  release()
  return tarball
}))
```

## grant & revoke

`grant` and `revoke` primitives let you give a semaphore more permits, or revoke them, indicating that there are more resources available.

```typescript
const sem = new Semaphore(5)
const emitter = new EventEmitter()

const queue = []
emitter.on('event', (e) => {
  queue.push(e)
  sem.grant()
})

// this is basically the same as how flowp's Channel works
while(await sem.revoke()) {
  const data = queue.pop()
}
```

## freeze & unfreeze

You can freeze the semaphore so it stops granting any new permits because the resource is temporarily unavailable. `revoke` is affected since it needs to collect permits (acquire) first before destroying them.

```typescript
const sem = new Semaphore(5)

sem.freeze()

await sem.revoke() // hanging forever
await sem.acquire() // hanging forever
```

```typescript
const sem = new Semaphore(1)
let socket = net.connect(host, port)

// socket disconnected, freeze the semaphore until reconnection
socket.on('close', err => {
  sem.freeze()
  socket = net.connect(host, port)
  socket.on('connect', () => sem.unfreeze())
})

// some other place
await sem.acquire()
socket.write(buf)
```

## inspect the semaphore

There are several getters that help you inspect current state of the semaphore.

```typescript
const sem = new Semaphore(5)

sem.isEmpty // true
sem.isFull // false
sem.permits // 5
sem.remain // 5
```