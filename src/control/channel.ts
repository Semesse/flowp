import { PipeSource, PipeTarget, read } from './pipeable'
import { Semaphore, transfer } from './semaphore'

export class ClosedChannelError extends Error {
  public message = 'channel is closed'
}

export interface ChannelStream<T> extends AsyncIterable<T> {
  next: () => Promise<T>
}

export class Channel<T> implements PipeSource<T>, PipeTarget<T> {
  #closed = false
  #capacity
  #queue: T[] = []
  #sendSem: Semaphore
  #recvSem: Semaphore
  #pipeTarget: PipeTarget<T> | null = null
  /**
   * should use Semaphore to control max capacity,
   * `false` if capacity is Infinity
   */
  #useSem: boolean

  /**
   * create a new multi-producer-single-consumer channel with specified capacity
   * @param capacity channel capacity, defaults to `Infinity`
   */
  public constructor(capacity = Infinity) {
    if (capacity < 0 || Number.isNaN(capacity)) {
      throw new RangeError('capacity cannot be negative or NaN')
    }
    this.#capacity = capacity
    this.#useSem = !Number.isFinite(capacity)
    this.#sendSem = new Semaphore(capacity)
    this.#recvSem = new Semaphore(0)
  }

  public async send(value: T) {
    if (this.#closed) throw new ClosedChannelError()
    if (this.#pipeTarget) {
      await this.#pipeTarget[read](value, this)
    } else {
      this.#useSem && (await transfer(this.#sendSem, this.#recvSem, 1))
      this.#queue.push(value)
    }
  }

  public async receive() {
    this.#useSem && (await transfer(this.#recvSem, this.#sendSem, 1))
    const value = this.#queue.shift()!
    return value
  }

  public trySend(value: T) {
    if (this.#queue.length + 1 > this.#capacity) throw new Error('queue is full')
    this.#queue.push(value)
  }

  public sendAsync(value: Promise<T>) {
    return value.then((v) => this.send(v))
  }

  /**
   * try receive one message
   * @returns message `T` or `undefined` if no messages in the queue
   */
  public tryReceive() {
    return this.#queue.shift()
  }

  public stream(): ChannelStream<T> {
    return {
      next: () => this.#next().then(({ value, done }) => (done ? Promise.reject(new Error('Finished')) : value)),
      [Symbol.asyncIterator]: () => {
        return {
          next: () => this.#next(),
          return: () => Promise.resolve({ value: undefined, done: true }),
        }
      },
    }
  }

  public [read](value: T) {
    this.send(value)
  }

  public pipe(target: PipeTarget<T>) {
    this.#pipeTarget = target
  }

  public unpipe() {
    this.#pipeTarget = null
  }

  public close() {
    this.#closed = true
  }

  public get capacity() {
    return this.#capacity
  }

  async #next(): Promise<IteratorResult<T, undefined>> {
    if (this.#closed) {
      const value = this.#queue.shift()
      return value === undefined ? { value: undefined, done: true } : { value, done: false }
    }
    return this.receive().then((value) => ({ value, done: false }))
  }
}
