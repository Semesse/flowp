import { Future } from './future'

/**
 * Barrier is a one-time signal that can be used in like ready states, close events etc.
 *
 * it's basically a special type of promise with no resolve value and will never reject.
 *
 * @example
 * ```
 * const serverReady = new Barrier()
 * server.on('listening', () => barrier.unlock())
 * await serverReady
 * ```
 *
 * @public
 */
export class Barrier implements PromiseLike<void> {
  private future: Future<void>
  public constructor() {
    this.future = new Future<void>()
  }
  public unlock() {
    this.future.resolve()
  }
  public get unlocked() {
    return this.future.fulfilled
  }
  public then<TResult1 = void, TResult2 = never>(
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
  ): PromiseLike<TResult1 | TResult2> {
    return this.future.then(onfulfilled)
  }
}
