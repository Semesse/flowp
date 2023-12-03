import { Future } from '../promise'
import type { PipeSource, PipeTarget } from '../protocol/pipeable'
import { read } from '../protocol/pipeable'
import { Semaphore, transfer } from './semaphore'

/**
 * Indicates that the buffered items in queue has reached its capacity
 *
 * @internal
 */
class ClosedChannelError extends Error {
  public message = 'channel is closed'
}

/**
 * Indicates that the buffered items in queue has reached its capacity
 *
 * @internal
 */
class ChannelFullError extends Error {
  public message = 'channel queue is full'
}

/**
 * Indicates that the buffered items in queue has reached its capacity
 *
 * @internal
 */
export interface ChannelStream<T> extends AsyncIterable<T> {
  next: () => Promise<T>
}

/**
 * @internal
 */
export interface ChannelPipeOptions {
  /**
   * Called when `target[read]` throws e.g. pipe a closed target channel.
   *
   * param will be called immediately every time the read throws an error.
   */
  onPipeError?: (err: unknown) => any
}

/**
 *
 * Promise based multi producer single consumer channel
 *
 *
 * - buffered message queue
 *
 * - `send` / `receive` basic message passing
 *
 * - `pipe` piping to other channels (or use `pipe.to()`)
 *
 * - `stream` ES6 async iterator api
 *
 * - `freeze` temporarily block all consumers, useful if your target has limited rate of consumption like Node.js net.Socket
 *
 * @typeParam T - type of messages in queue
 * @public
 */
export class Channel<T> implements PipeSource<T>, PipeTarget<T> {
  /**
   * ```
   * class ClosedChannelError extends Error
   * ```
   */
  public static ClosedChannelError = ClosedChannelError
  /**
   * ```
   * class ChannelFullError extends Error
   * ```
   */
  public static ChannelFullError = ChannelFullError

  private _closed = false
  private _capacity
  private queue: T[] = []
  private sendSem: Semaphore
  private recvSem: Semaphore
  private pipeTarget: PipeTarget<T> | null = null
  private pipeOptions?: ChannelPipeOptions
  private paused?: Future<void>
  /**
   * should use sendSem to control maximum messages queued,
   * `false` if capacity is Infinity
   */
  private bounded: boolean

  /**
   * create a new channel with specified capacity
   * @typeParam T - type of messages in queue
   * @param capacity - channel capacity, defaults to `Infinity`
   *
   * @throws RangeError - capacity is negative or NaN
   */
  public constructor(capacity = Infinity) {
    if (capacity < 0 || Number.isNaN(capacity)) {
      throw new RangeError('capacity cannot be negative or NaN')
    }
    this._capacity = capacity
    this.bounded = Number.isFinite(capacity)
    this.sendSem = new Semaphore(capacity)
    this.recvSem = new Semaphore(0)
  }

  /**
   * send a value to channel.
   *
   * if the channel has reached its capacity, then call to `send` will be blocked
   *
   * @throws -{@link Channel.ClosedChannelError} throw if channel is closed
   */
  public async send(value: T) {
    if (this._closed) throw new ClosedChannelError()
    if (!this.pipeTarget) {
      this.bounded ? await transfer(this.sendSem, this.recvSem, 1) : this.recvSem.grant()
    }
    this.writeValue(value)
  }

  /**
   * retrieve a value from channel.
   *
   * will never resolve if {@link Channel.pipe} or is enabled;
   * will race with {@link Channel.stream}
   */
  public async receive(): Promise<T> {
    await transfer(this.recvSem, this.sendSem, 1)
    // since we already acquired 1 token fron recvSem, queue should not be empty
    const value = this.queue.shift()!
    return value
  }

  /**
   * try to send a value synchronosly
   *
   * @throws -{@link Channel.ClosedChannelError} channel is closed
   * @throws -{@link Channel.ChannelFullError} channel is full
   */
  public trySend(value: T) {
    if (this._closed) throw new ClosedChannelError()
    if (this.queue.length + 1 > this._capacity) throw new ChannelFullError()
    this.writeValue(value)
  }

  /**
   * send a promise to channel, after the promise is resolved, send its fullfilled value
   */
  public sendAsync(value: Promise<T>) {
    return value.then((v) => this.send(v))
  }

  /**
   * try receive one message
   * @returns message `T` or `undefined` if no messages in the queue
   */
  public tryReceive() {
    return this.queue.shift()
  }

  /**
   * get a stream to read from the channel, internally uses {@link Channel.receive}
   */
  public stream(): ChannelStream<T> {
    return {
      next: async () => {
        const next = await this.next()
        if (next.done) throw new Error('Finished')
        return next.value
      },
      [Symbol.asyncIterator]: () => {
        return {
          next: () => this.next(),
          return: () => Promise.resolve({ value: undefined, done: true }),
        }
      },
    }
  }

  /**
   * @internal
   */
  public [read](value: T) {
    // synchronos call to wait and write
    if (this._closed) throw new ClosedChannelError()
    if (this.bounded) {
      transfer(this.sendSem, this.recvSem, 1).then(() => this.writeValue(value))
    } else {
      this.recvSem.grant()
      this.writeValue(value)
    }
  }

  /**
   * pipe channel output to target
   *
   * there is only one target at the same time, use `ChannelHub` if you want to have multiple readers
   */
  public pipe(target: PipeTarget<T>, options?: ChannelPipeOptions) {
    this.pipeTarget = target
    this.pipeOptions = options
    if (!this.paused) this.flushQueue()
  }

  /**
   * unlink output with target, future input will be stored in channel's internal buffer
   */
  public unpipe() {
    this.pipeTarget = null
    this.pipeOptions = undefined
  }

  /**
   * stop {@link Channel.stream} / {@link Channel.pipe} / {@link Channel.receive} new items until {@link Channel.resume} is called
   *
   * items sending to the channel will be queued despite pipe enabled
   */
  public pause() {
    this.recvSem.freeze()
    this.paused = new Future()
  }

  /**
   * resume the channel so {@link Channel.stream} / {@link Channel.pipe} / {@link Channel.receive} can continue to handle new messages
   */
  public resume() {
    this.paused?.resolve()
    if (this.pipeTarget) {
      this.flushQueue()
    }
  }

  /**
   * close the channel, future `send` will throw a {@link Channel.ClosedChannelError}
   */
  public close() {
    this._closed = true
  }

  /**
   * check if channel has been closed
   */
  public get closed() {
    return this._closed
  }

  /**
   * Get the number of maximum items in queue
   */
  public get capacity() {
    return this._capacity
  }

  /**
   * Get the number of current queued items
   */
  public get size() {
    return this.queue.length
  }

  /**
   * **SHOULD** check `capacity` and `closed` state before calling this method.
   *
   * if check inside `writeValue`, there is a chance that `close` is called immediately after `send`
   * while writeValue is `asynchronosly` called in `send` and will unexpectedly throw an error
   */
  private writeValue(value: T) {
    if (this.pipeTarget && !this.paused) {
      this.flushValue(value)
    } else {
      this.queue.push(value)
    }
  }

  /**
   * empty current queue by writing all values to pipe target
   */
  private flushQueue() {
    for (const v of this.queue) {
      this.flushValue(v)
    }
    this.queue = []
  }

  /**
   * write single item to pipe target
   */
  private flushValue(value: T) {
    try {
      this.pipeTarget?.[read](value, this)
    } catch (err) {
      this.pipeOptions?.onPipeError?.(err)
    }
  }

  private async next(): Promise<IteratorResult<T, undefined>> {
    if (this._closed) {
      const value = this.queue.shift()
      return value === undefined ? { value: undefined, done: true } : { value, done: false }
    }
    return this.receive().then((value) => ({ value, done: false }))
  }
}
