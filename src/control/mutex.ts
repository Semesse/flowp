import { Semaphore } from './semaphore'

/**
 * Asynchronos style mutex lock
 *
 * @public
 */
export class Mutex {
  private semaphore: Semaphore

  /**
   * {@link Semaphore} with capacity of 1
   */
  public constructor() {
    this.semaphore = new Semaphore(1)
  }

  /**
   * same as {@link Semaphore.acquire}
   */
  public async lock() {
    return this.semaphore.acquire()
  }

  /**
   * same as {@link Semaphore.tryAcquire}
   */
  public tryLock() {
    return this.semaphore.tryAcquire()
  }

  /**
   * check if mutex is available
   */
  public get canLock() {
    return this.semaphore.isEmpty
  }

  /**
   * Schedule a task to run when mutex is not locked.
   */
  public schedule<T>(fn: () => T) {
    return this.semaphore.schedule(fn)
  }

  /**
   * freeze the mutex lock, see {@link Semaphore.freeze}
   */
  public freeze() {
    return this.semaphore.freeze()
  }

  /**
   * unfreeze the mutex lock, see {@link Semaphore.unfreeze}}
   */
  public unfreeze() {
    return this.semaphore.unfreeze()
  }
}
