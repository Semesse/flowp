import { pipe } from '../protocol'
import { Channel, ChannelFullError, ClosedChannelError } from './channel'

describe('channel', () => {
  it('unbound channel should be able to send and receive', async () => {
    const channel = new Channel()
    const value = 42
    await channel.send(value)
    expect(await channel.receive()).toBe(value)
    await channel.send(value)
    expect(await channel.receive()).toBe(value)
  })

  it('bound channel should be able to send and receive', async () => {
    const channel = new Channel(1)
    expect(channel.capacity).toBe(1)
    const value = 42
    await channel.send(value)
    expect(await channel.receive()).toBe(value)
    await channel.send(value)
    expect(await channel.receive()).toBe(value)
  })

  it('async iterates', async () => {
    const channel = new Channel()
    const value = 42
    await channel.send(value)
    channel.close()
    for await (const v of channel.stream()) {
      expect(v).toBe(value)
    }

    const channel2 = new Channel()
    channel2.send(value)
    // eslint-disable-next-line no-unreachable-loop
    for await (const v of channel2.stream()) {
      expect(v).toBe(value)
      break
    }
    channel2.close()
  })

  it('try send to unbound channel', async () => {
    const channel = new Channel(1)
    const value = 42

    channel.trySend(value)
    expect(channel.tryReceive()).toBe(value)

    channel.trySend(value)
    expect(() => channel.trySend(value)).toThrow(Error)
    channel.tryReceive()
    expect(channel.tryReceive()).toBeUndefined()

    await channel.sendAsync(Promise.resolve(value))
    expect(await channel.receive()).toBe(value)

    // send an error
    expect(channel.sendAsync(Promise.reject(new Error('test')))).rejects.toThrow('test')
  })

  it('try send to bound channel exceeding its capacity', async () => {
    const channel = new Channel(1)
    expect(channel.capacity).toBe(1)
    const value = 42
    channel.trySend(value)
    expect(() => channel.trySend(value)).toThrow(ChannelFullError)
  })

  it('try send to closed channel', async () => {
    const channel = new Channel()
    expect(channel.closed).toBe(false)
    channel.close()
    expect(() => channel.trySend(42)).toThrow(ClosedChannelError)
    expect(channel.closed).toBe(true)
  })

  it('receive from empty unbound channel', async () => {
    const channel = new Channel()
    expect(
      Promise.race([
        channel.receive(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error()), 100)
        }),
      ])
    ).rejects.toBeTruthy()
  })

  it('receive from empty bound channel', async () => {
    const channel = new Channel(1)
    expect(
      Promise.race([
        channel.receive(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error()), 100)
        }),
      ])
    ).rejects.toBeTruthy()
  })

  it('try receive from empty unbound channel', async () => {
    const channel = new Channel()
    expect(channel.tryReceive()).toBe(undefined)
  })

  it('try receive from empty bound channel', async () => {
    const channel = new Channel(1)
    expect(channel.tryReceive()).toBe(undefined)
  })

  it('validate channel capacity', () => {
    expect(() => new Channel(-1)).toThrow(RangeError)
  })

  it('should not send to closed channel', async () => {
    const channel = new Channel()
    channel.close()
    expect(channel.send(42)).rejects.toThrow(ClosedChannelError)
    expect(channel.receive)
  })

  it('unbound channel should pipe', async () => {
    const channel1 = new Channel()
    const channel2 = new Channel()
    channel1.pipe(channel2)
    await channel1.send(42)
    await channel1.send(1024)
    expect(await channel2.receive()).toBe(42)
    expect(await channel2.receive()).toBe(1024)
    channel1.unpipe()
    await channel1.send(42)
    expect(channel2.tryReceive()).toBeUndefined()
  })

  it('bound channel should pipe', async () => {
    const channel1 = new Channel(1)
    const channel2 = new Channel(5)
    channel1.pipe(channel2)
    await channel1.send(42)
    // since it pipes to a channel with larger capcacity, we can send ignoring channel1's capacity
    await channel1.send('hello')
    expect(await channel2.receive()).toBe(42)
    expect(await channel2.receive()).toBe('hello')

    channel1.unpipe()
    await channel1.send(42)
    expect(channel2.tryReceive()).toBeUndefined()
  })

  it('pipe should clear existing queue', async () => {
    const channel1 = new Channel(1)
    const channel2 = new Channel()
    await channel1.send(1)
    await channel2.send(2)
    await channel2.send(3)
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    channel1.pipe(pipe.to(fn1))
    channel2.pipe(pipe.to(fn2))
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(2)
  })

  it('do nothing when piping to closed channels', async () => {
    const channel1 = new Channel()
    const channel2 = new Channel()
    channel1.pipe(channel2)
    channel2.close()
    channel1.send(test).catch(console.error)
  })

  it('custom handler when writing to closed channels', async () => {
    const channel1 = new Channel()
    const channel2 = new Channel()
    const handler = jest.fn()
    channel1.pipe(channel2, { onPipeError: handler })
    channel2.close()
    await channel1.send(0)
    expect(handler).toBeCalledWith(expect.any(ClosedChannelError))
  })

  it('can have only one receivers', async () => {
    const channel = new Channel()
    const value = 42
    await channel.send(value)
    const receiver = jest.fn()
    const a = channel.stream()
    const b = channel.stream()
    channel.close()
    await Promise.all([
      (async () => {
        for await (const v of a) {
          receiver(v)
        }
      })(),
      (async () => {
        for await (const v of b) {
          receiver(v)
        }
      })(),
    ])
    expect(receiver).toHaveBeenCalledTimes(1)
  })
})
