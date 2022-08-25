import { vi } from 'vitest'
import { Channel } from '../control'
import { PipeAdapter } from './pipeable'

describe('pipeable', () => {
  it('transform data in pipe', async () => {
    const pipe = new PipeAdapter<number, string>((v) => v.toFixed(2))
    const channel1 = new Channel<number>()
    const channel2 = new Channel<string>()
    channel1.pipe(pipe)
    pipe.pipe(channel2)
    channel1.send(42)
    expect(await channel2.receive()).toBe('42.00')
  })

  it('should not send after unpipe', async () => {
    const handler = vi.fn()
    const pipe = new PipeAdapter<number, string>(handler)
    const channel = new Channel<number>()
    channel.pipe(pipe)
    pipe.unpipe()
    channel.send(42)
    expect(handler).toBeCalledTimes(0)
  })
})
