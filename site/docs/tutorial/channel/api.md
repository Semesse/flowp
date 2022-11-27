---
sidebar_position: 2
---

# API

## Class

```typescript
class Channel<T> implements PipeSource<T>, PipeTarget<T>
```

Where:

`T`: type of messages in Channel, defaults to `unknown`. Note `void` or `undefined` is allowed but this will make return values from [tryReceive](#tryreceive) indistinguishable from message itself.

`PipeSource<T>`: it has the method [pipe](#pipe) to bind a target to write values to.

`PipeTarget<T>`: it has an internal method that accepts messages from `PipeSource`.

## Properties

### capacity

```typescript
get capacity(): number
```

Returns the capacity of the channel.

### size

```typescript
get size(): number
```

Inspects current number of elements queued in the channel.


### closed

```typescript
get closed(): boolean
```

Check if the channel is closed.

## Methods

### constructor

```typescript
constructor(capacity?: number = Infinity);
```

Create a new channel with specified capacity. By default, the capacity will be `Infinite`, meaning the channel can buffer unlimited items within its internal queue (but array size may not exceed runtime).

Example:

```typescript
import { Channel } from 'flowp'

//create an unbounded channel
const ch = new Channel()
// create a bounded channel which transmit strings
const ch = new Channel<string>(50)
// passing invalid capacity will result in error
const ch = new Channel(-1) // => throw RangeError
```

### Send & Receive

#### send

```typescript
send(value: T): Promise<void>;
```

Sends a value to channel, and returns a promise which is resolved when the value is pushed to channel's internal buffer and available for consumers.

If the channel has reached its capacity, then call to send will be blocked until any message is consumed.

#### receive

```typescript
receive(): Promise<T>;
```

Retrieves a value from channel. The returned promise will never resolve if [pipe](#pipe) is enabled, and may race with [stream](#stream). It's suggested to use only one style at the same time.

#### trySend

```typescript
trySend(value: T): void;
```

Synchronosly sends a value to channel, and may throw `ChannelFullError` if not able to push to queue or `ClosedChannelError` if the channel is closed.

#### tryReceive

```typescript
tryReceive(): T | undefined;
```

Synchronosly receives a value from channel, returns value or undefined if no message is available.

#### sendAsync

```typescript
sendAsync(value: Promise<T>): Promise<void>
```

Sends a promise to the channel, message is queued once the promise is resolved.

:::note
There is no corresponding `receiveAsync` method since it would be identical to [receive](#receive).
:::

Examples:

```typescript
const ch = new Channel<Response>()

// somewhere
ch.send(response)
try {
  ch.trySend(response)
} catch (err) {
  // channel is full or closed
}
ch.sendAsync(fetch('https://example.com'))

// elsewhere
const res = await ch.receive()
// or
const res = ch.tryReceive()
if (res) {
  // message available in the channel
}
```

### Pipe to other targets

#### pipe

```typescript
pipe(target: PipeTarget<T>, options?: ChannelPipeOptions): void

interface ChannelPipeOptions {
  /**
   * Called when `target[read]` throws e.g. pipe a closed target channel.
   *
   * param will be called immediately every time the read throws an error.
   */
  onPipeError?: (err: unknown) => any
}
```

Sets channel's output mode to `pipe` and all messages will be directly written to target (unless [frozen](#freeze)). You can pass an extra `options` param to setup an error handler. Capacity related checks are skipped so this is faster than [receive](#receive) and [stream](#stream).

You can only have one pipe target at a time, but you can use `ChannelHub` if you want multiple readers

Some pipe helpers are available and exported under [pipe](../pipe) namespace.

#### unpipe

```typescript
unpipe(): void
```

Unsets pipe and subsequent messages will be queued.

Examples:

```typescript
import { pipe } from 'flowp'

const ch1 = new Channel<Response>()
const ch2 = new Channel<User>()

ch1.pipe(
  pipe.to((res) => ch2.sendAsync(res.json())),
  {
    onPipeError(err) {
      ch1.pause()
    },
  }
)
```

### Async iterates through channel

![ES2018](https://img.shields.io/badge/ECMAScript-2018-blue?style=flat-square)

#### stream

```typescript
stream(): ChannelStream<T>

interface ChannelStream<T> extends AsyncIterable<T> {
  next: () => Promise<T>
}
```

Creates a stream that can be used in [for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) syntax.

It is suggested not to use only [receive](#receive) and [stream](#stream) at the same time.

Examples:

```typescript
for await (const v of channel.stream()) {
  console.log(v)
}
```

### Pause and resume

#### pause

```typescript
pause(): void
```

Pauses the channel, blocking [receive](#receive) | [tryReceive](#tryreceive) | [stream](#stream) | [pipe](#pipe) from retriving messages. This is useful when downstream consumes messages at a limited rate. 

#### resume

```typescript
pause(): void
```

Resumes the channel so [receive](#receive) | [tryReceive](#tryreceive) | [stream](#stream) | [pipe](#pipe) can continue to handle new messages.

Examples:

```typescript
const channel = new Channel()
const socket = net.connect(host, port)

channel.pipe(pipe.to((buffer) => {
  if (socket.write(buffer)) {
    pipe.pause()
    socket.once('drain', () => channel.resume())
  }
}))
```

### Close the channel

#### close

```typescript
close(): void
```

Closes the channel and subsequent calls to [send](#send) will throw an error.

Existing messages can still be consumed until the last message in queue has been received,
then call to [receive](#receive) will return a rejected promise.
