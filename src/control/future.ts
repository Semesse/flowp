/**
 * Future is a resolve-later Promise, you can resolve it any time after a future is created.
 *
 * @example
 *
 * ```typescript
 * const future = new Future<number>()
 * // somewhere
 * const count = await future
 * // elsewhere, and the future becomes `fullfilled`
 * future.resolve(count)
 * ```
 */
export class Future<T> extends Promise<T> {
  static #constructors: [(value: any | PromiseLike<any>) => void, (error: unknown) => void][] = []
  #resolve: (value: T | PromiseLike<T>) => void
  #reject: (error: unknown) => void

  public static get [Symbol.species]() {
    return Promise
  }

  public constructor() {
    // executor is called immediately in Promise constructor
    // https://tc39.es/ecma262/#sec-promise-executor
    super((resolve, reject) => {
      // since `this` is not accessible before super() finished
      Future.#constructors.push([resolve, reject])
    })
    ;[this.#resolve, this.#reject] = Future.#constructors.pop()!
  }

  /**
   * resolve the future with given value
   *
   * tips: the method has already bound to `this`, so you can write `emitter.on('event', future.resolve)`
   */
  public get resolve(): (value: T | PromiseLike<T>) => void {
    return (value) => this.#resolve(value)
  }

  /**
   * resolve the future with given value
   *
   * tips: the method has already bound to `this`, so you can write `emitter.on('error', future.reject)`
   */
  public get reject(): (error: unknown) => void {
    return (error) => this.#reject(error)
  }
}
