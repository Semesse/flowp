import { PipeSource, PipeTarget, read } from './pipeable'
import { Semaphore, transfer } from './semaphore'

export class ClosedChannelError extends Error {
  message = 'channel is closed'
}

export interface ChannelStream<T> extends AsyncIterable<T> {
  next(): Promise<T>
}

export class Channel<T> implements PipeSource<T>, PipeTarget<T> {
  #closed = false
  #capacity
  #queue: T[] = []
  #sendSem: Semaphore
  #recvSem: Semaphore
  #pipeTarget: PipeTarget<T> | null = null

  /**
   * create a new multi-producer-single-consumer channel with specified capacity
   * @param capacity channel capacity, defaults to `Infinity`
   */
  constructor(capacity: number = Infinity) {
    if (capacity < 0 || Number.isNaN(capacity)) {
      throw new RangeError('capacity cannot be negative or NaN')
    }
    this.#capacity = capacity
    this.#sendSem = new Semaphore(capacity)
    this.#recvSem = new Semaphore(0)
  }

  async send(value: T) {
    if (this.#closed) throw new ClosedChannelError()
    if (this.#pipeTarget) {
      await this.#pipeTarget[read](value)
    } else {
      await transfer(this.#sendSem, this.#recvSem, 1)
      this.#queue.push(value)
    }
  }

  async receive() {
    await transfer(this.#recvSem, this.#sendSem, 1)
    const value = this.#queue.shift()!
    return value
  }

  trySend(value: T) {
    if (this.#queue.length + 1 > this.#capacity) throw new Error('queue is full')
    this.#queue.push(value)
  }

  sendAsync(value: Promise<T>) {
    return value.then((v) => this.send(v))
  }

  /**
   * try receive one message
   * @returns message `T` or `undefined` if no messages in the queue
   */
  tryReceive() {
    return this.#queue.shift()
  }

  stream(): ChannelStream<T> {
    const self = this
    return {
      next: () => self.#next().then(({ value, done }) => (done ? Promise.reject() : value)),
      [Symbol.asyncIterator]() {
        return {
          next: () => self.#next(),
          return: () => Promise.resolve({ value: undefined, done: true }),
        }
      },
    }
  }

  [read](value: T) {
    this.send(value)
  }

  pipe(target: PipeTarget<T>) {
    this.#pipeTarget = target
  }

  unpipe() {
    this.#pipeTarget = null
  }

  close() {
    this.#closed = true
  }

  get capacity() {
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
