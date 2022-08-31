import { Semaphore } from './semaphore'

/**
 * Asynchronos style mutex lock
 *
 * @public
 */
export class Mutex {
  #semaphore: Semaphore

  /**
   * {@link Semaphore} with capacity of 1
   */
  public constructor() {
    this.#semaphore = new Semaphore(1)
  }

  /**
   * alias for {@link Mutex.acquire}
   */
  public async lock() {
    return this.acquire()
  }

  /**
   * acquire mutex lock, will resolve once ready
   * @returns a function to release lock
   */
  public async acquire() {
    return await this.#semaphore.acquire()
  }

  /**
   * Try to synchronosly acquire
   * @returns a function to release mutex lock
   * @throws Error if mutex is already acquired
   */
  public tryAcquire() {
    return this.#semaphore.tryAcquire()
  }

  /**
   * check if mutex is available
   */
  public get canLock() {
    return this.#semaphore.isEmpty
  }
}
