export class Future<T> extends Promise<T> {
  static #constructors: [(value: any | PromiseLike<any>) => void, (error: unknown) => void][] = []
  #resolve: (value: T | PromiseLike<T>) => void
  #reject: (error: unknown) => void

  static get [Symbol.species]() {
    return Promise
  }

  constructor() {
    // executor is called immediately in Promise constructor
    // https://tc39.es/ecma262/#sec-promise-executor
    super((resolve, reject) => {
      // since `this` is not accessible before super() finished
      Future.#constructors.push([resolve, reject])
    })
    ;[this.#resolve, this.#reject] = Future.#constructors.pop()!
  }

  public resolve(value: T | PromiseLike<T>) {
    this.#resolve(value)
  }

  public reject(error: unknown) {
    this.#reject(error)
  }
}
