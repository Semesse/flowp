/**
 * util.promisify only works on browser
 */

/**
 * **resolve** after timeout (in miliseconds)
 *
 * @public
 */
export const sleep = (ms: number) => {
  return new Promise((r) => {
    setTimeout(r, ms)
  })
}

/**
 * **reject** after timeout (in miliseconds)
 *
 * @public
 */
export const timeout = (ms: number, err?: string | Error) => {
  return new Promise((_, r) => {
    setTimeout(
      () => r(typeof err === 'string' ? new Error(err) : typeof err === 'undefined' ? new Error('timeout') : err),
      ms
    )
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
