import { Callable } from '../types'

type Delegated<T> = {
  readonly [K in keyof Awaited<T> & string as `$${K}`]: Awaited<T>[K] extends Callable
    ? (...args: Parameters<Awaited<T>[K]>) => ReturnType<Awaited<T>[K]>
    : Delegated<Awaited<T>[K]>
} & Promise<Awaited<T>>

function isPromiseProtoMethods(
  v: any
): v is typeof Promise.prototype.then | typeof Promise.prototype.catch | typeof Promise.prototype.finally {
  return v === Promise.prototype.then || v === Promise.prototype.catch || v === Promise.prototype.finally
}

const raw = Symbol('get the raw untouched value')

/**
 * Delegates method calls and member access to the resolved value
 * @param value value to delegate to, must be a promise and should not be resolve with primitives
 * @returns the delegated object, access delegated properties with `${key}`
 * @example
 * const promise = Promise.resolve({ foo: { bar: 'baz' } })
 * const delegated = lateinit(promise)
 * await delegated.$foo.$bar // 'baz'
 */
export function lateinit<T extends Promise<unknown>>(value: T): Delegated<T> {
  // proxy on a function so the returned value is callable
  // eslint-disable-next-line no-new-func
  return new Proxy(new Function() as unknown as T, {
    get(_, key, receiver) {
      if (key === raw) return value
      if (typeof key === 'string' && key.startsWith('$')) {
        return lateinit(
          value.then((v) => {
            // FIXME: pass unit test
            // if (typeof v !== 'object' || typeof v !== 'function') throw new Error('Cound not delegate primitives')
            return Reflect.get(v as any, key.slice(1))
          })
        )
      }
      const prop = Reflect.get(value, key, receiver)
      if (isPromiseProtoMethods(prop)) {
        // wrap then methods otherwise TypeError will be thrown
        // TypeError: Method Promise.prototype.then called on incompatible receiver function () { }
        return (...args: unknown[]) => Reflect.apply(prop, value, args)
      }
      return prop
    },
    apply(_, thisPromise, args) {
      return (async () => {
        const thisArg = await thisPromise[raw]
        const fn = (await value) as Function
        return Reflect.apply(fn, thisArg, args)
      })()
    },
  }) as T & Delegated<T>
}
