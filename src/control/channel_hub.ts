import { Channel } from './channel'
import { PipeTarget, read } from './pipeable'

/**
 * compose multiple channels into one
 */
export class ChannelHub<T = unknown> implements PipeTarget<T> {
  /** a helper function, equivalant to ChannelHub.constructor */
  public static from<T>(writers?: Channel<T>[], readers?: Channel<T>[]) {
    return new ChannelHub(writers, readers)
  }

  private readers: Channel<T>[]
  private writers: Channel<T>[]

  public constructor(writers?: Channel<T>[], readers?: Channel<T>[]) {
    this.readers = readers || []
    this.writers = writers || []
    this.writers.forEach((w) => w.pipe(this))
  }

  /**
   * send a valut to the hub, will be received by all readers or pipe target
   * @param value
   */
  public broadcast(value: T) {
    this.readers.forEach((r) => r.send(value))
  }

  /**
   * get a reader channel that can get messages from channel hub
   * you can only use one of pipe or readers at the same time
   */
  public reader() {
    const ch = new Channel<T>()
    this.readers.push(ch)
    return ch
  }

  /**
   * get a writer channel that can send messages to channel hub
   */
  public writer() {
    const ch = new Channel<T>()
    ch.pipe(this)
    this.writers.push(ch)
    return ch
  }

  public [read](value: T) {
    this.broadcast(value)
  }

  public close() {
    this.writers.forEach((ch) => ch.close())
    this.readers.forEach((ch) => ch.close())
  }
}
