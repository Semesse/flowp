import { Channel } from './channel'
import { Pipe, PipeSource, PipeTarget, read } from './pipeable'

/**
 * compose multiple channels into one
 */
export class ChannelHub<T = unknown> implements Pipe<T, T> {
  public static from<T>(...channels: Channel<T>[]) {
    return new ChannelHub(...channels)
  }

  #channels: Set<Channel<T>> = new Set()
  #channel: Channel<T> = new Channel()

  public constructor(...channels: Channel<T>[]) {
    channels.forEach((c) => this.plug(c))
  }

  public [read](value: T, source?: PipeSource<T>) {
    this.#channel.send(value)
  }
  public pipe(target: PipeTarget<T>) {
    this.#channel.pipe(target)
  }
  public unpipe() {
    this.#channel.unpipe()
  }

  public plug(channel: Channel<T>) {
    this.#channels.add(channel)
    channel.pipe(this.#channel)
  }

  public unplug(channel: Channel<T>) {
    if (!this.#channels.has(channel)) return
    this.#channels.delete(channel)
    channel.unpipe()
  }

  public fork() {
    const channel = new Channel<T>()
    this.plug(channel)
    return channel
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
