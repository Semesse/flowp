import { Channel } from './channel'
import { PipeAdapter } from './pipeable'

/**
 * compose multiple channels into one
 */
export class ChannelHub {
  public static from(...channels: Channel<unknown>[]) {
    return new ChannelHub(...channels)
  }

  #channels: Set<Channel<unknown>> = new Set()
  #channel: Channel<readonly [unknown, Channel<unknown>]> = new Channel()

  public constructor(...channels: Channel<unknown>[]) {
    channels.forEach((c) => this.plug(c))
  }

  public plug(channel: Channel<unknown>) {
    this.#channels.add(channel)
    const adapter = new PipeAdapter((v) => [v, channel] as const)
    channel.pipe(adapter)
    adapter.pipe(this.#channel)
  }

  public unplug(channel: Channel<unknown>) {
    if (!this.#channels.has(channel)) return
    this.#channels.delete(channel)
    channel.unpipe()
  }

  public stream() {
    return this.#channel.stream()
  }

  public close() {
    this.#channels.forEach((c) => this.unplug(c))
    this.#channel.close()
  }

  public get channels() {
    return this.#channels
  }
}
