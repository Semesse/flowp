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
export interface PipeTarget<T, S = PipeSource<T>> {
  [read]: (value: T, source?: S) => void
}

export interface Pipe<TIn, TOut> extends PipeTarget<TIn>, PipeSource<TOut> {}

export class PipeAdapter<TIn, TOut> implements PipeTarget<TIn, PipeSource<TIn>>, PipeSource<TOut> {
  public handler: (value: TIn, source?: PipeSource<TIn>) => TOut
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

  public [read](value: TIn, source?: PipeSource<TIn>): void {
    this.#target?.[read](this.handler(value, source), this)
  }
}

export const to = <T>(fn: (v: T, s?: PipeSource<T>) => any): PipeTarget<T> => {
  return { [read]: fn }
}

export class PipeToConsole implements PipeTarget<any, PipeSource<any>> {
  public [read](value: any, source?: PipeSource<any>) {
    console.log(source, value)
  }
}
