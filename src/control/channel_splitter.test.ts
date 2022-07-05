import { Channel } from './channel'
import { ChannelSplitter } from './channel_splitter'

describe('channel splitter', () => {
  it('split one channel into multiple', async () => {
    const channel = new Channel()
    const splitter = new ChannelSplitter(channel)
    const sp1 = splitter.fork()
    const sp2 = splitter.fork()
    channel.send(0)
    expect(await sp1.receive()).toBe(0)
    expect(await sp2.receive()).toBe(0)
  })

  it('broadcast same reference', async () => {
    const channel = new Channel()
    const splitter = new ChannelSplitter(channel)
    const sp1 = splitter.fork()
    const sp2 = splitter.fork()
    channel.send({})
    expect(await sp1.receive()).toBe(await sp2.receive())
  })
})
