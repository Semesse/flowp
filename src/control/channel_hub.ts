import { Channel } from './channel'
import { PipeTarget, read } from '../protocol/pipeable'

/**
 * compose multiple channels into one
 *
 * @public
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
    if (new Set([...this.readers, ...this.writers]).size < this.writers.length + this.readers.length)
      throw new Error('readers and writers must not have overlap')
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
   *
   * use {@link ChannelHub.disconnect} if you don't want to receive messages from the hub
   */
  public reader() {
    const ch = new Channel<T>()
    this.readers.push(ch)
    return ch
  }

  /**
   * get a writer channel that can send messages to channel hub
   *
   * use {@link ChannelHub.disconnect} if you don't want to send messages to the hub
   */
  public writer() {
    const ch = new Channel<T>()
    ch.pipe(this)
    this.writers.push(ch)
    return ch
  }

  /**
   * diconnect a channel from the hub, could be a reader or a writer
   *
   * disconnected channel will NOT be closed automatically,
   * they can still be used to send and receive messages
   */
  public disconnect(ch: Channel<T>) {
    let index = this.readers.indexOf(ch)
    if (index !== -1) {
      return this.readers.splice(index, 1)
    }
    index = this.writers.indexOf(ch)
    if (index !== -1) {
      ch.unpipe()
      this.writers.splice(index, 1)
    }
  }

  /**
   * @internal
   */
  public [read](value: T) {
    this.broadcast(value)
  }

  public close() {
    this.writers.forEach((ch) => ch.close())
    this.readers.forEach((ch) => ch.close())
  }
}
