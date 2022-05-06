import { Channel } from './channel'
import { ChannelHub } from './channel_hub'

describe('channel hub', () => {
  it('should compose multiple channels into one', async () => {
    const channel1 = new Channel()
    const channel2 = new Channel()
    const channel3 = new Channel()
    const channelHub = ChannelHub.from(channel1, channel2, channel3)
    const stream = channelHub.stream()
    await channel1.send('a')
    await channel2.send('b')
    await channel3.send('c')
    expect(await stream.next()).toEqual(['a', channel1])
    expect(await stream.next()).toEqual(['b', channel2])
    expect(await stream.next()).toEqual(['c', channel3])
    channelHub.close()
  })

  it('unplug a channel that is not plugged should have no effect', () => {
    const channel1 = new Channel()
    const channel2 = new Channel()
    const channelHub = ChannelHub.from(channel1)
    channelHub.unplug(channel2)
    expect(channelHub.channels.has(channel2)).toBeFalsy()
  })
})
