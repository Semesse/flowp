import { once } from '../utils/functools'
import { Future } from '../promise'

/**
 * Semaphore with async api
 * @param permits - number of permits
 * @public
 *
 * @example
 * const sem = new Semaphore(5)
 * const release = await sem.acquire()
 * // do something
 * release()
 */
export class Semaphore {
  /**
   * check if semaphore is frozen (non-undefined value), other uses are not guaranteed
   */
  public frozen?: Future<void>
  private _permits: number
  // the first {permits} items in the queue are running tasks or frozen, others are waiting
  private queue: Future<void>[] = []

  /**
   * constructs a new Semaphore with n permits
   * @param permits - number of permits
   */
  public constructor(permits?: number) {
    this._permits = permits ?? Infinity
  }

  /**
   * Acquire a permit, resolve when resouce is available.
   * @returns a function to release semaphore
   */
  public async acquire(timeout?: number) {
    const self = new Future<void>()
    this.queue.push(self)

    if (!Number.isFinite(timeout) || timeout === undefined) {
      // continue
    } else if (timeout >= 0) {
      setTimeout(() => {
        self.reject(new Error('timeout'))
        this.resolveNext()
        this.remove(self)
      }, timeout)
    } else {
      throw new Error('timeout must be valid')
    }

    // throw if self.reject because of timeout
    // otherwise wait frozen & self are all ready
    if (this.queue.length > this._permits || this.frozen) {
      if (this.frozen) await Promise.all([self, this.frozen])
      else await self
    }

    return this.releaser(self)
  }

  /**
   * Try to synchronosly acquire if there's remaining permits
   * @returns a function to release the semaphore
   * @throws Error if semaphore is drained
   */
  public tryAcquire() {
    if (this.queue.length < this._permits && !this.frozen) {
      const self = new Future<void>()
      this.queue.push(self)
      return this.releaser(self)
    }
    throw new Error("can't acquire semaphore")
  }

  /**
   * Schedule a task to run when a permit is available and automatically release after run.
   */
  public async schedule<T>(fn: () => T): Promise<Awaited<T>> {
    const release = await this.acquire()
    const res = await fn()
    release()
    return res
  }

  /**
   * Give n permits to the semaphore, will immediately start this number of waiting tasks if not frozen
   * @param permits - number of permits
   * @throws RangeError - if permits is less than 0
   */
  public grant(permits = 1) {
    if (permits < 0) throw RangeError('permits must be positive')
    this.resolveNext(permits)
    this._permits += permits
  }

  /**
   * Destroy n permits, effective until `remain` fills the n permits
   *
   * **note**: you may need to check if `permits > semaphore.permits`, or it will wait until granted that many permits
   * @param permits - number of permits
   * @throws RangeError - if permits is less than 0
   */
  public async revoke(permits = 1) {
    if (permits < 0) throw new Error('permits must be positive')
    // if n is Infinity, will wait until all running tasks are released
    const tokens = Array.from({ length: Number.isFinite(permits) ? permits : this.queue.length })
      .fill(0)
      .map(() => this.acquire())
    const release = await Promise.all(tokens)
    if (!Number.isFinite(permits)) {
      this._permits = 0
    } else {
      this._permits -= permits
    }
    release.forEach((r) => r())
  }

  /**
   * Freeze this semaphore, calling `acquire` won't resolve and `tryAcquire` will throw (release can still be called).
   *
   * NOTE: don't call this again if {@link Semaphore.frozen}, not supported yet
   */
  public freeze() {
    this.frozen = new Future<void>()
  }

  /**
   * unfreeze this semaphore, it is synchronos and the returned value should be ignored
   * @returns a promise that's already resolved you can add a
   */
  public unfreeze(): Promise<void> {
    if (!this.frozen) return Promise.resolve()

    const frozen = this.frozen
    this.frozen = undefined
    // this will trigger all promises
    frozen?.resolve()
    return frozen
  }

  /**
   * Get the number of remaining permits
   */
  public get remain() {
    return Math.max(this._permits - this.queue.length, 0)
  }

  /**
   * Get the number of total permits currently
   */
  public get permits() {
    return this._permits
  }

  /**
   * Check if all permits are being used
   */
  public get isFull() {
    return this.queue.length >= this._permits
  }

  /**
   * Check if no task is using the semaphore
   */
  public get isEmpty() {
    return this.queue.length === 0
  }

  private releaser(token: Future<void>) {
    // return a function to release semaphore
    // should not provide `release` on semaphore instance because the order of `release` is not guaranteed
    return once(() => {
      this.resolveNext()
      this.remove(token)
    })
  }

  /**
   * resolves next n values in the queue.
   *
   * If semaphore is frozen, wait for `frozen` to resolve first.
   * These queued items are although the first {permits} elements in the queue, they are not resolved.
   */
  private async resolveNext(count = 1) {
    for (let i = this._permits; i < this._permits + count; i++) {
      this.frozen ? this.frozen.then(() => this.queue.at(i)?.resolve()) : this.queue.at(i)?.resolve()
    }
  }

  private remove(token: Future<void>) {
    const index = this.queue.indexOf(token)
    // this is already removed, do nothing
    /* c8 ignore start */
    if (index === -1) return
    /* c8 ignore end */

    this.queue.splice(index, 1)
  }
}

/**
 * transfer n permits from one semaphore to another
 * @param from - semaphore to revoke permits
 * @param to - semaphore to grant permits
 * @param tokens - number of permits, defaults to 1
 *
 * @internal
 */
export const transfer = async (from: Semaphore, to: Semaphore, tokens = 1) => {
  await from.revoke(tokens)
  to.grant(tokens)
}
