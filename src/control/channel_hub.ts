import { Channel } from './channel'
import { PipeAdapter } from './pipeable'

/**
 * compose multiple channels into one
 */
export class ChannelHub {
  #channels: Set<Channel<unknown>> = new Set()
  #channel: Channel<readonly [unknown, Channel<unknown>]> = new Channel()

  static from(...channels: Channel<unknown>[]) {
    return new ChannelHub(...channels)
  }

  constructor(...channels: Channel<unknown>[]) {
    channels.forEach((c) => this.plug(c))
  }

  plug(channel: Channel<unknown>) {
    this.#channels.add(channel)
    const adapter = new PipeAdapter((v) => [v, channel] as const)
    channel.pipe(adapter)
    adapter.pipe(this.#channel)
  }

  unplug(channel: Channel<unknown>) {
    if (!this.#channels.has(channel)) return
    this.#channels.delete(channel)
    channel.unpipe()
  }

  stream() {
    return this.#channel.stream()
  }

  close() {
    this.#channels.forEach((c) => this.unplug(c))
    this.#channel.close()
  }

  get channels() {
    return this.#channels
  }
}
