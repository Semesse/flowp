import { borrow } from '../utils/borrow'
import { Semaphore } from './semaphore'

/**
 * a value created by `mutex.lock()`
 *
 * calling the `guard()` or `guard.release()` will release the mutex and revoke `MutexGuard.value`
 * so that any subsequent access to the value will throw a TypeError
 *
 * @public
 */
export type MutexGuard<V> = V extends object
  ? {
      (): void
      release: () => void
      value: V
    }
  : () => void

/**
 * Asynchronos style mutex lock
 *
 * @typeParam V - type of the object wrapped by the mutex, and a immutable T does not make sense
 * @public
 */
export class Mutex<V = void> {
  protected _value!: V
  private semaphore: Semaphore

  /**
   * {@link Semaphore} with capacity of 1
   *
   * @param value - you may optionally wrap an object with mutex
   */
  public constructor()
  public constructor(value: V)
  public constructor(value?: V) {
    this.semaphore = new Semaphore(1)
    if (value) this._value = value
  }

  /**
   * acquire lock
   *
   * @returns `MutexGuard` - a function to release the lock, you can access wrapped value using `MutexGuard.value` before release
   *
   * @example
   * ```typescript
   * const mutex = new Mutex({ a: 1 })
   * const { release, value } = await mutex.lock()
   * const ref = value
   * ref.a // => 1
   * release()
   * ref.a // => TypeError, temporary reference destroyed
   * ```
   */
  public async lock(timeout?: number): Promise<MutexGuard<V>> {
    return this.semaphore.acquire(timeout).then((release) => {
      return this.createLockGuard(release)
    })
  }

  /**
   * synchronosly acquire lock
   *
   * @throws Error if failed to acquire lock
   * @returns `MutexGuard` - a function to release the lock, you can access wrapped value using `MutexGuard.value` before release
   *
   * @example
   * ```typescript
   * const mutex = new Mutex({ a: 1 })
   * const { release, value } = mutex.tryLock()
   * const ref = value // value is a temporary reference which does not equal the value stores in mutex
   * ref.a // => 1
   * release()
   * ref.a // => TypeError, temporary reference destroyed
   * ```
   */
  public tryLock() {
    const release = this.semaphore.tryAcquire()
    return this.createLockGuard(release)
  }

  /**
   * check if mutex is available, returns true if it is not locked and frozen
   */
  public get canLock() {
    return this.semaphore.isEmpty && !this.semaphore.frozen
  }

  /**
   * Schedule a task to run when mutex is not locked.
   */
  public schedule<T>(fn: (v: V) => T) {
    // create a guard but keep it secret until we have acquired the lock
    const guard = this.createLockGuard(() => {})
    const ret = this.semaphore.schedule(async () => {
      // @ts-expect-error for runtime undefined value == void
      // but it's slightly different to call fn() and fn(undefined) since the latter's arguments.length is 1
      return this._value !== undefined ? await fn(guard.value) : await fn()
    })

    return ret
      .catch((e) => {
        throw e
      })
      .finally(guard)
  }

  /**
   * freeze the mutex lock, see {@link Semaphore.freeze}
   */
  public freeze() {
    return this.semaphore.freeze()
  }

  /**
   * unfreeze the mutex lock, see {@link Semaphore.unfreeze}
   */
  public unfreeze() {
    return this.semaphore.unfreeze()
  }

  /**
   * unfreeze the mutex lock, see {@link Semaphore.unfreeze}
   */
  public get frozen() {
    return !!this.semaphore.frozen
  }

  private createLockGuard(release: () => void) {
    if (typeof this._value === 'object' && this._value !== null) {
      const [ref, revoke] = borrow(this._value)
      const guard = (() => {
        revoke()
        release()
      }) as MutexGuard<object>
      guard.release = guard
      guard.value = ref
      return guard as MutexGuard<V>
    }
    return release as MutexGuard<V>
  }
}
