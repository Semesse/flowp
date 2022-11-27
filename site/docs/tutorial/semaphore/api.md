---
sidebar_position: 2
title: Semaphore & Mutex
---

# Semaphore & Mutex

## Semaphore Class

```typescript
class Semaphore
```

[Semaphore](#semaphore-class) is a simple class without any implements / extends or generic parameters.

## Properties

### permits

```typescript
get permits(): number
```

Returns the maximum number of permits of this semaphore.

### remain

```typescript
get remain(): number
```

Inspects current remaining permits of this semaphore.

### isFull

```typescript
get isFull(): boolean
```

Check if the semaphore has drained its permits. Always return `true` if `permits = 0`

### isEmpty

```typescript
get isEmpty(): boolean
```

Check if the semaphore has not yet give out any permits. Always return `true` if `permits = 0`

## Methods

### constructor

```typescript
constructor(permits?: number)
```

Constructs a new Semaphore with n permits. The number of permits can be adjusted later using [grant](#grant) or [revoke](#revoke) methods.

### acquire

```typescript
acquire(timeout?: number): Promise<() => void>
```

Acquires a permit from the semaphore and returns a Promise which will be fulfilled with a function to release the permit. The release function can only be called once and subsequent calls will have no effect.

:::note
It might seem different from other libraries or semaphores in other languages, there's no `sem.revoke()` method since internally it's not a "counter" but a queue of acquirers, and this pattern is fallible as caller cannot prove he has previously acquired any permit. [grant](#grant) and [revoke](#revoke) do what you need.
:::

### tryAcquire

```typescript
tryAcquire(): () => void
```

Synchronosly acquires a permit and throws if the semaphore has no remaining permit.

### schedule

```typescript
schedule<T>(fn: () => T): Promise<Awaited<T>>
```

Schedule a task to run when a permit is available and automatically release after run.

Examples:

```typescript
const sem = new Semaphore(5)

// concurrency limit
const tarballs = Promise.all(packages.map(async (package) => {
  const release = await sem.acquire()
  const tarball = await download(package)
  release()
  return tarball
}))

// drop requests
server.on((request) => {
  try {
    const release = sem.tryAcquire()
    handle(request)
    release()
  } catch (error) {
    console.log('dropped request')
  }
})

// or schedule concurrent tasks with automatic release
await Promise.all(tasks => sem.schedule(() => do(task)))
```

### grant

```typescript
grant(permits?: number): void
```

Give n permits to semaphore, will immediately start this number of waiting tasks if not frozen.

### revoke

```typescript
revoke(permits?: number): Promise<void>
```

Revoke n permits from semaphore. It collect this number of permits first by calling [acquire](#acquire) and destroys them, then reduce max number of permits by n.

Examples:

```typescript
const sem = new Semaphore(5)
const emitter = new EventEmitter()

const queue = []
emitter.on('event', (e) => {
  queue.push(e)
  sem.grant()
})

// this is basically the same as how flowp's Channel works
while (await sem.revoke()) {
  const data = queue.pop()
}
```

### freeze

```typescript
freeze(): void
```

Freeze this semaphore, calling [acquire](#acquire) won't resolve and [tryAcquire](#tryacquire) will throw (release can still be called).

### unfreeze

```typescript
unfreeze(): Promise<void>
```

Unfreeze this semaphore, queued tasks start to run immediately.

it is synchronos and the returned value should be ignored.

Examples:

```typescript
const sem = new Semaphore(5)

sem.freeze()

setTimeout(() => sem.unfreeze(), 5000)

await sem.revoke() // hanging until timeout
await sem.acquire() // hanging until timeout
```

```typescript
const sem = new Semaphore(1)
let socket = net.connect(host, port)

// socket disconnected, freeze the semaphore until reconnection
socket.on('close', (err) => {
  sem.freeze()
  socket = net.connect(host, port)
  socket.on('connect', () => sem.unfreeze())
})

// some other place
await sem.acquire()
socket.write(buf)
```

# Mutex Class

## Interface

### MutexGuard

a value created by `mutex.lock()`, `mutex.tryLock()` or `mutex.schedule()`. It contains a `value` property which is a temporary reference to the value stored in the mutex, and you can access its properties as long as you didn't release the lock.

```typescript
/**
 * calling the `guard()` or `guard.release()` will release the mutex and revoke `MutexGuard.value`
 * so that any subsequent access to the value will throw a TypeError
 */
export type MutexGuard<V> = V extends object
  ? {
      (): void
      release: () => void
      value: V
    }
  : () => void
```

## Class

```typescript
class Mutex<V = void>
```
Where:

`V`: type of the object wrapped by the mutex, and a immutable T does not make sense

[Mutex](#mutex-class) does not extend Semaphore because it removes some unnecessary methods / props from Semaphore.

## Properties

### canLock

```typescript
get canLock(): boolean
```

Alias for [Semaphore.isEmpty](#isempty)

### frozen

```typescript
get frozen(): boolean
```

Check if mutex is frozen

## Methods

### constructor

```typescript
constructor()
```

Constructs a Mutex and its capacity is always 1.

### lock

```typescript
lock(timeout?: number): Promise<MutexGuard<V>>
```

acquire lock, returns a [`MutexGuard`](#mutexguard)

```typescript
const mutex = new Mutex({ a: 1 })
const { release, value } = await mutex.lock()
const ref = value
ref.a // => 1
release()
ref.a // => TypeError, temporary reference destroyed

### tryLock

```typescript
tryLock(): () => void
```

acquire lock, returns a [`MutexGuard`](#mutexguard)

```typescript
const mutex = new Mutex({ a: 1 })
const { release, value } = mutex.tryLock()
const ref = value
ref.a // => 1
release()
ref.a // => TypeError, temporary reference destroyed
```

### schedule

```typescript
schedule<T>(fn: (v: V) => T): Promise<Awaited<T>>
```

Same as [Semaphore.schedule](#schedule).

Examples:

```typescript
const mut = new Mutex()

// Promise.serial
const tarballs = Promise.all(packages.map(async (package) => {
  const release = await mut.lock()
  const tarball = await download(package)
  release()
  return tarball
}))

// or serialize concurrent tasks with automatic release
await Promise.all(tasks => mut.schedule(() => do(task)))
```

### freeze

```typescript
freeze(): void
```

Same as [Semaphore.freeze](#freeze).

### unfreeze

```typescript
unfreeze(): Promise<void>
```

Same as [Semaphore.unfreeze](#unfreeze).

### frozen

```typescript
get frozen(): boolean
```
Same as [Semaphore.frozen](#frozen).