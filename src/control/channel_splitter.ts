import { Channel } from './channel'
import { Pipe, PipeAdapter, PipeSource, PipeTarget, read } from './pipeable'

/**
 * Broadcast data from a single channel
 */
export class ChannelSplitter<T> implements PipeTarget<T> {
  public static from<T>(channel: Channel<T>) {
    return new ChannelSplitter(channel)
  }
  #channel: Channel<T> = new Channel()
  #channels: Channel<Readonly<T>>[] = []

  public constructor(channel: Channel<T>) {
    this.#channel = channel
    this.broadcast()
  }

  public [read](value: T, source?: PipeSource<T>) {
    this.#channel.send(value)
  }

  /** create a fork that reveives message channel */
  public fork(): Channel<T> {
    const channel = new Channel<T>()
    this.#channels.push(channel)
    return channel
  }

  public close() {
    this.#channel.close()
    this.#channels.forEach((c) => c.close())
  }

  /** loop over channel's message and send to all forks */
  private async broadcast() {
    try {
      for await (const m of this.#channel.stream()) {
        this.#channels.forEach((c) => c.send(m))
      }
    } catch (err) {
      // the stream has ended
    }
  }
}
