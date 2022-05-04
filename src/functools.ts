import { Callable } from './types'

/**
 * ensure function to be called once, and only once
 *
 * note: `this` is dropped
 * @param fn the function to call for the first time
 * @param subsequent the function to call after the first one
 * @returns function that will call `fn` for the first time, and then `subsequent`
 */
export function once<T extends Callable>(
  fn: T & ThisType<null>,
  subsequent?: (lastResult: ReturnType<T>, ...args: Parameters<T>) => any
): T {
  let called = false
  let lastResult: ReturnType<T>
  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true
      lastResult = Reflect.apply(fn, null, args)
      return lastResult
    }
    if (subsequent) {
      return Reflect.apply(subsequent, null, [lastResult, ...args])
    }
  }) as T
}
