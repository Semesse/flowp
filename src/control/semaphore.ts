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
  #queue: Future<void>[] = []

  constructor(permits?: number) {
    this.#permits = permits ?? Infinity
  }

  /**
   * acquire semaphore
   * @returns a function to release semaphore
   */
  async acquire(timeout: number = Infinity) {
    const self = new Future<void>()
    if (this.isFull) {
      // istanbul ignore else
      if (Number.isFinite(timeout)) {
        console.log('full', timeout)
        setTimeout(() => {
          self.reject(new Error('timeout'))
          this.#remove(self)
        }, timeout)
      }
      await self
    }

    this.#queue.push(self)
    return this.#release(self)
  }

  tryAcquire() {
    if (this.#queue.length < this.#permits) {
      const self = new Future<void>()
      this.#queue.push(self)
      return this.#release(self)
    }
    throw new Error()
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
    // should not provide `release` on instance because the order of `release` is not guaranteed
    return once(() => {
      this.#remove(token)
      this.#queue.at(this.permits)?.resolve()
    })
  }

  #remove(token: Future<void>) {
    const index = this.#queue.indexOf(token)
    // this is already removed, do nothing
    // istanbul ignore if
    if (index === -1) return

    this.#queue.splice(index, 1)
  }
}
