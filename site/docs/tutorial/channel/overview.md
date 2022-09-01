---
sidebar_position: 1
description: Overview of Channel's features
---

# Overview

Promise based multi producer single consumer channel, which can serve as an in-memory message queue.

## buffered message queue

A channel can be created specifying its maximum capacity, messages will be buffered in queue until they're consumed.

```typescript
const ch = new Channel<string>(10)
```

## `send` / `receive` message transmit

Send message on one side, and receive on the other side. There are some synchronos variant available, see [API](./api)

```typescript
// somewhere
ch.send()
// elsewhere
await ch.receive()
// or
try {
  ch.tryReceive()
} catch (err) {
  // no message available in channel
}
```

## piping to other channels (or use `pipe.to()`)

```typescript
import { pipe } from 'flowp' // if you need to pipe to custom target

const ch2 = new Channel<string>()

// pipe to another channel
ch.pipe(ch2, {
  // triggered when writing message to target causes an error, e.g. ChannelClosedError
  onPipeError: () => {},
})

ch.pipe(
  pipe.to(() => {
    // custom consumer
  })
)

// a small helper
ch.pipe(pipe.to.console('error'))
```

## consume with async iterator syntax

Use async iterator to consume messages.

```typescript
const stream = ch.stream()

for await (const v of stream) {
  handle(v)
}
```

## temporarily block all consumers

Block `receive` / `tryReceive` / `stream` / `pipe` from retriving new messages. It's useful if your target has limited rate of consumption like Node.js `net.Socket`

```typescript
channel.pipe(
  pipe.to((buf) => {
    if (!socket.write(buf)) {
      channel.pause()
      socket.once('drain', () => channel.resume())
    }
  })
)
```
