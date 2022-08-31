/**
 * Future is a resolve-later Promise, you can resolve it any time after a future is created.
 *
 * @public this feature is stable and is guaranteed to not have breaking change before v1.0.0
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
export class Future<T = unknown> extends Promise<T> {
  private static _constructors: [(value: any | PromiseLike<any>) => void, (error: unknown) => void][] = []
  protected _resolve: (value: T | PromiseLike<T>) => void
  protected _reject: (error: unknown) => void

  public static get [Symbol.species]() {
    return Promise
  }

  public constructor() {
    // executor is called immediately in Promise constructor
    // https://tc39.es/ecma262/#sec-promise-executor
    super((resolve, reject) => {
      // since `this` is not accessible before super() finished
      Future._constructors.push([resolve, reject])
    })
    ;[this._resolve, this._reject] = Future._constructors.pop()!
  }

  /**
   * resolve the future with given value
   *
   * tips: the method has already bound to `this`, so you can write `emitter.on('event', future.resolve)`
   */
  public get resolve(): (value: T | PromiseLike<T>) => void {
    return (value) => this._resolve(value)
  }

  /**
   * reject the future with given value, [UnhandledRejection] will be thrown when rejecting before `.catch`
   *
   * tips: the method has already bound to `this`, so you can write `emitter.on('error', future.reject)`
   */
  public get reject(): (error?: unknown) => void {
    return (error) => this._reject(error)
  }
}
