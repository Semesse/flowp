/**
 * util.promisify only works on browser
 */

export interface SleepTimer {
  (ms: number): Promise<void>
  <T>(ms: number, value: T): Promise<T>
}

/**
 * **resolve** after timeout (in miliseconds), can pass in an optional resolved value
 *
 * @public
 */
export const sleep: SleepTimer = <T = unknown>(ms: number, value?: T) => {
  return new Promise<T>((r) => {
    setTimeout(() => r(value!), ms)
  })
}

/**
 * **reject** after timeout (in miliseconds)
 *
 * By default, reject with `Error('timeout')`, but can pass in an optional rejected value
 *
 * @public
 */
export const timeout = (ms: number, err?: string | Error) => {
  return new Promise((_, r) => {
    setTimeout(() => r(err ?? new Error('timeout')), ms)
  })
}

/**
 * **resolve** with given value immediately (aka. setImmediate)
 *
 * @public
 */
export const immediately = <T>(value?: T): Promise<T | undefined> => {
  return new Promise((r) => {
    setImmediate(() => r(value))
  })
}
