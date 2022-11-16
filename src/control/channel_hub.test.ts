import { Channel } from './channel'
import { ChannelHub } from './channel_hub'
import { to } from '../protocol/pipeable'
import { vi, describe, it, expect } from 'vitest'
import { timers } from '../promise'

describe('channel hub', () => {
  it('should compose multiple channels into one', async () => {
    const channel1 = new Channel()
    const channel2 = new Channel()
    const channel3 = new Channel()
    const channelHub = ChannelHub.from([channel1, channel2, channel3])
    const stream = channelHub.reader().stream()
    await channel1.send('a')
    await channel2.send('b')
    await channel3.send('c')
    expect(await stream.next()).toEqual('a')
    expect(await stream.next()).toEqual('b')
    expect(await stream.next()).toEqual('c')
    channelHub.close()
  })

  it('refuse to have a channel as both reader and writer', async () => {
    const ch = new Channel()
    expect(() => new ChannelHub([ch], [ch])).toThrow()
  })

  it('create writer', async () => {
    const hub = new ChannelHub()
    const w = hub.writer()
    const r = hub.reader()
    await w.send(0)
    expect(await r.receive()).toBe(0)
  })

  it('should not write on closed hub', async () => {
    const hub = new ChannelHub()
    const ch = hub.writer()
    hub.close()
    expect(ch.send(0)).rejects.toThrow()
  })

  it('should pipe', async () => {
    const hub = new ChannelHub()
    const channel1 = new Channel()
    const channel2 = new Channel()
    const reader = hub.reader()
    channel1.pipe(hub)
    channel2.pipe(hub)

    const fn = vi.fn()
    reader.pipe(to((v) => fn(v)))
    await channel1.send('a')
    await channel2.send('b')
    expect(fn).toHaveBeenNthCalledWith(1, 'a')
    expect(fn).toHaveBeenNthCalledWith(2, 'b')

    reader.unpipe()
    await channel1.send(0)
    expect(fn).toBeCalledTimes(2)
  })

  it('disconnect writer channel', async () => {
    const hub = new ChannelHub<number>()
    const reader = hub.reader()
    const writer = hub.writer()
    writer.send(0)
    hub.disconnect(writer)
    expect(await reader.receive()).toBe(0)
    writer.send(1)
    expect(Promise.race([reader.receive(), timers.timeout(100)])).rejects.toMatchInlineSnapshot('[Error: timeout]')
  })

  it('disconnect reader channel', async () => {
    const hub = new ChannelHub<number>()
    const reader = hub.reader()
    const writer = hub.writer()
    writer.send(0)
    hub.disconnect(reader)
    expect(await reader.receive()).toBe(0)
    writer.send(1)
    expect(Promise.race([reader.receive(), timers.timeout(100)])).rejects.toMatchInlineSnapshot('[Error: timeout]')
  })
})
