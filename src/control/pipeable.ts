export const read = Symbol('pipeable')

/**
 * a pipe source should be able to write its output to a pipe target
 */
export interface PipeSource<T> {
  pipe: (target: PipeTarget<T>) => void
  unpipe: () => void
}

/**
 * a pipe target can receive data from a pipe source
 */
export interface PipeTarget<T> {
  [read]: (value: T) => void
}

export class PipeAdapter<TIn, TOut> implements PipeSource<TOut>, PipeTarget<TIn> {
  public handler: (value: TIn) => TOut
  #target: PipeTarget<TOut> | null = null

  /**
   * creates a pipe that transforms data from `TIn` to `TOut`
   * @param handler transform data in pipe
   */
  public constructor(handler: (value: TIn) => TOut) {
    this.handler = handler
  }

  public pipe(target: PipeTarget<TOut>): void {
    this.#target = target
  }

  public unpipe(): void {
    this.#target = null
  }

  public [read](value: TIn): void {
    this.#target?.[read](this.handler(value))
  }
}
