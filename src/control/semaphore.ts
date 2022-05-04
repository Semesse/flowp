import { once } from '../functools'
import { Future } from './future'

/**
 * Semaphore
 * @param permits number of permits
 *
 * @example
 * const sem = new Semaphore(5)
 * const release = await sem.acquire()
 * // do something
 * release()
 */
export class Semaphore {
  #permits: number
  #debt = 0
  // the first {permits} items in the queue are running, others are waiting
  #queue: Future<void>[] = []

  constructor(permits?: number) {
    this.#permits = permits ?? Infinity
  }

  /**
   * acquire semaphore
   * @returns a function to release semaphore
   */
  async acquire(timeout?: number) {
    const self = new Future<void>()
    this.#queue.push(self)

    if (this.#queue.length > this.#permits) {
      if (!Number.isFinite(timeout) || timeout === undefined) {
        // continue
      } else if (timeout >= 0) {
        setTimeout(() => {
          self.reject(new Error('timeout'))
          this.#remove(self)
        }, timeout)
      } else {
        throw new Error('timeout must be valid')
      }
      await self
    }

    return this.#release(self)
  }

  tryAcquire() {
    if (this.#queue.length < this.#permits) {
      const self = new Future<void>()
      this.#queue.push(self)
      return this.#release(self)
    }
    throw new Error("can't acquire semaphore")
  }

  grant(permits: number = 1) {
    if (permits < 0) throw new Error('permits must be positive')
    this.#resolveNext(permits)
    this.#permits += permits
  }

  async revoke(permits: number = 1) {
    if (permits > this.#permits) throw new Error('does not have that much permits')
    if (permits < 0) throw new Error('permits must be positive')
    if (!Number.isFinite(permits)) {
      this.#permits = 0
      this.#debt += this.#queue.length
    } else {
      this.#permits -= permits
      this.#debt += permits
    }
  }

  get remain() {
    return Math.max(this.#permits - this.#queue.length, 0)
  }

  get permits() {
    return this.#permits
  }

  get isFull() {
    return this.#queue.length >= this.#permits
  }

  get isEmpty() {
    return this.#queue.length === 0
  }

  #release(token: Future<void>) {
    // return a function to release semaphore
    // should not provide `release` on semaphore instance because the order of `release` is not guaranteed
    return once(() => {
      if (this.#debt) {
        this.#debt--
      } else {
        this.#resolveNext()
      }
      this.#remove(token)
    })
  }

  #resolveNext(count: number = 1) {
    for (let i = this.#permits; i < this.#permits + count; i++) {
      this.#queue.at(i)?.resolve()
    }
  }

  #remove(token: Future<void>) {
    const index = this.#queue.indexOf(token)
    // this is already removed, do nothing
    // istanbul ignore if
    if (index === -1) return

    this.#queue.splice(index, 1)
  }
}

export const transfer = async (from: Semaphore, to: Semaphore, tokens: number) => {
  await from.revoke(tokens)
  to.grant(tokens)
}
