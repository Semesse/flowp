import { Channel, ClosedChannelError } from './channel'

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
    for await (const v of channel2.stream()) {
      expect(v).toBe(value)
      break
    }
  })

  it('try send', async () => {
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

    expect(channel.sendAsync(Promise.reject(new Error('test')))).rejects.toThrow('test')
  })

  it('valite channel capacity', () => {
    expect(() => new Channel(-1)).toThrow(RangeError)
  })

  it('should not send to closed channel', async () => {
    const channel = new Channel()
    channel.close()
    expect(channel.send(42)).rejects.toThrow(ClosedChannelError)
  })
})
