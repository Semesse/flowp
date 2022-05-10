import { once } from '../utils/functools'
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
  // the first {#permits} items in the queue are running, others are waiting
  #queue: Future<void>[] = []

  /**
   * constructs a new Semaphore with n permits
   * @param permits number of permits
   */
  public constructor(permits?: number) {
    this.#permits = permits ?? Infinity
  }

  /**
   * Acquire a permit, will not resolve if the semaphore is full
   * @returns a function to release semaphore
   */
  public async acquire(timeout?: number) {
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

  /**
   * Try to synchronosly acquire if the semaphore is not full
   * @throws Error if semaphore is full
   */
  public tryAcquire() {
    if (this.#queue.length < this.#permits) {
      const self = new Future<void>()
      this.#queue.push(self)
      return this.#release(self)
    }
    throw new Error("can't acquire semaphore")
  }

  /**
   * Give n permits to semaphore, will immediately start this number of waiting tasks if any
   * @param permits
   * @throws RangeError if permits < 0
   */
  public grant(permits = 1) {
    if (permits < 0) throw RangeError('permits must be positive')
    this.#resolveNext(permits)
    this.#permits += permits
  }

  /**
   * Destroy n permits, effective until `remain` fills the n permits
   *
   * **note**: you may need to check if `permits > semaphore.permits`, or it will wait until granted that many permits
   * @param permits number of permits
   * @throws RangeError if permits < 0
   */
  public async revoke(permits = 1) {
    if (permits < 0) throw new Error('permits must be positive')
    // if n is Infinity, will wait until all running tasks are released
    const tokens = Array.from({ length: Number.isFinite(permits) ? permits : this.#queue.length })
      .fill(0)
      .map(() => this.acquire())
    const release = await Promise.all(tokens)
    if (!Number.isFinite(permits)) {
      this.#permits = 0
    } else {
      this.#permits -= permits
    }
    release.forEach((r) => r())
  }

  /**
   * Get the number of remaining permits
   */
  public get remain() {
    return Math.max(this.#permits - this.#queue.length, 0)
  }

  /**
   * Get the number of total permits currently
   */
  public get permits() {
    return this.#permits
  }

  /**
   * Check if all permits are being used
   */
  public get isFull() {
    return this.#queue.length >= this.#permits
  }

  /**
   * Check if no task is using the semaphore
   */
  public get isEmpty() {
    return this.#queue.length === 0
  }

  #release(token: Future<void>) {
    // return a function to release semaphore
    // should not provide `release` on semaphore instance because the order of `release` is not guaranteed
    return once(() => {
      this.#resolveNext()
      this.#remove(token)
    })
  }

  #resolveNext(count = 1) {
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

/**
 * transfer n permits from one semaphore to another
 * @param from semaphore to revoke permits
 * @param to semaphore to grant permits
 * @param tokens number of permits, defaults to 1
 */
export const transfer = async (from: Semaphore, to: Semaphore, tokens = 1) => {
  await from.revoke(tokens)
  to.grant(tokens)
}
