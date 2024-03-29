/**
 * @internal
 */
export const read = Symbol('pipeable')

/**
 * a pipe source should be able to write its output to a pipe target
 *
 * @public
 */
export interface PipeSource<T> {
  pipe: (target: PipeTarget<T>) => void
  unpipe: () => void
}

/**
 * a pipe target can receive data from a pipe source
 *
 * @public
 */
export interface PipeTarget<T, S = PipeSource<T>> {
  [read]: (value: T, source?: S) => void
}

/**
 * @public
 */
export interface Pipe<TIn, TOut> extends PipeTarget<TIn>, PipeSource<TOut> {}

/**
 * @public
 */
export class Transform<TIn, TOut> implements PipeTarget<TIn, PipeSource<TIn>>, PipeSource<TOut> {
  public handler: (value: TIn, source?: PipeSource<TIn>) => TOut
  private target: PipeTarget<TOut> | null = null

  /**
   * creates a pipe that transforms data from `TIn` to `TOut`
   * @param handler - transform data in pipe
   */
  public constructor(handler: (value: TIn) => TOut) {
    this.handler = handler
  }

  public pipe(target: PipeTarget<TOut>): void {
    this.target = target
  }

  public unpipe(): void {
    this.target = null
  }

  /**
   * @internal
   */
  public [read](value: TIn, source?: PipeSource<TIn>): void {
    this.target?.[read](this.handler(value, source), this)
  }
}

/**
 * @public
 */
const to = <T>(fn: (v: T, s?: PipeSource<T>) => any): PipeTarget<T> => {
  return { [read]: fn }
}

/**
 * @public
 */
export type ConsoleLevel = 'debug' | 'log' | 'warn' | 'error'
/* c8 ignore next 3 */
to.console = (level: ConsoleLevel = 'log') => {
  return { [read]: console[level] }
}
/* c8 ignore start */
// don't know why c8 is reporting an empty line :(
export { to }
/* c8 ignore end */
