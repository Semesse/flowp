import { Future } from '../promise/future'
import { PipeSource, PipeTarget, read } from '../protocol/pipeable'
import { Semaphore, transfer } from './semaphore'

export class ClosedChannelError extends Error {
  public message = 'write on closed channel'
}

export class ChannelFullError extends Error {
  public message = 'channel queue is full'
}

export interface ChannelStream<T> extends AsyncIterable<T> {
  next: () => Promise<T>
}

export interface ChannelPipeOptions {
  /**
   * called when piping to a closed target or target[read] throws, might be called multiple times
   */
  onPipeError?: (err: unknown) => any
}

export class Channel<T> implements PipeSource<T>, PipeTarget<T> {
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
   * create a new multi-producer-single-consumer channel with specified capacity
   * @param capacity channel capacity, defaults to `Infinity`
   *
   * @throws {RangeError} capacity is negative or NaN
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
   * send a value to channel
   *
   * @throws {ClosedChannelError} throw if channel is closed
   */
  public async send(value: T) {
    if (this._closed) throw new ClosedChannelError()
    if (!this.pipeTarget) {
      this.bounded ? await transfer(this.sendSem, this.recvSem, 1) : this.recvSem.grant()
    }
    this.writeValue(value)
  }

  /**
   * retrieve a value from channel
   *
   * will never resolve if {@link Channel.pipe} or is enabled;
   * will race with {@link Channel.stream}
   */
  public async receive(): Promise<T> {
    await transfer(this.recvSem, this.sendSem, 1)
    // istanbul ignore if
    if (!this.queue.length) throw new Error('queue is empty, this is a bug in library `flowp`')
    const value = this.queue.shift()!
    return value
  }

  /**
   * try to send a value synchronosly
   *
   * @throws {ClosedChannelError} channel is closed
   * @throws {ChannelFullError} channel is full
   */
  public trySend(value: T) {
    if (this._closed) throw new ClosedChannelError()
    if (this.queue.length + 1 > this._capacity) throw new ChannelFullError()
    this.writeValue(value)
  }

  /**
   * send a promise to channel
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
      next: () => this.next().then(({ value, done }) => (done ? Promise.reject(new Error('Finished')) : value)),
      [Symbol.asyncIterator]: () => {
        return {
          next: () => this.next(),
          return: () => Promise.resolve({ value: undefined, done: true }),
        }
      },
    }
  }

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
   * stop streaming / piping / sending new items until {@link resume} is called
   *
   * items sending to the channel will be queued despite pipe enabled
   */
  public pause() {
    this.recvSem.freeze()
    this.paused = new Future()
  }

  public resume() {
    this.paused?.resolve()
    if (this.pipeTarget) {
      this.flushQueue()
    }
  }

  /**
   * close the channel, future `send` will throw a `ClosedChannelError`
   */
  public close() {
    this._closed = true
  }

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

  // empty current queue by writing all values to pipe target
  private flushQueue() {
    for (const v of this.queue) {
      this.flushValue(v)
    }
    this.queue = []
  }

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
