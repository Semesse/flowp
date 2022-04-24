import { inspect } from 'util'
import { Callable } from '../types'
import { Future } from './future'

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

export function lateinit<T extends Promise<any>>(value: T): Delegated<T> {
  return new Proxy(new Function() as unknown as T, {
    get(_, key, receiver) {
      if (typeof key === 'string' && key.startsWith('$')) {
        return lateinit(
          value.then((v) => {
            return Reflect.get(v, key.slice(1))
          })
        )
      }
      const prop = Reflect.get(value, key, receiver)
      if (isPromiseProtoMethods(prop)) {
        // wrap then methods otherwise TypeError will be thrown
        // TypeError: Method Promise.prototype.then called on incompatible receiver function () { }
        return (...args: any) => Reflect.apply(prop, value, args)
      }
      return prop
    },
    apply(_, thisArg, args) {
      return value.then((v) => Reflect.apply(v, v, args))
    },
  }) as T & Delegated<T>
}
