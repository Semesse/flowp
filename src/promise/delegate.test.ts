/// <reference lib="esnext.weakref" />
import { vi, describe, it, expect } from 'vitest'
import { delegate } from './delegate'

class TestClass extends Promise<any> {
  public test = 42
  public constructor(resolve: any) {
    super(resolve)
  }
}
class PrivateClass {
  #field = 1
  public get field() {
    return this.#field
  }
  public fn() {
    return this.#field
  }
}
const tee = delegate(
  new Promise<Console>((resolve) => {
    setTimeout(() => resolve(console), 100)
  })
)
const fs = delegate(import('fs'))
const u = delegate(Promise.resolve({ universe: { value: 42 } }))
const objectWithPrivateField = delegate(Promise.resolve(new PrivateClass()))
const deepObject = delegate(Promise.resolve({ a: { b: 114514, c: new WeakRef(u), d: () => '🐳' } }))

describe('delegate', () => {
  it('should not proxy other properties', async () => {
    const v = new TestClass(() => 42)
    const delegated = delegate(v)
    // typescript does not support HKTs the return type is always `Promise`
    // @ts-ignore
    expect(delegated.test).toBe(v.test)
  })

  it('should work with async/await', async () => {
    expect(await tee).toEqual(console)
    expect(await u).toEqual({ universe: { value: 42 } })
    expect(await u.$universe).toEqual({ value: 42 })
    expect(await u.$universe.$value).toEqual(42)
  })

  it('should work with then/catch/finally', async () => {
    const _catch = vi.fn()
    const _finally = vi.fn()
    const content: Buffer = await fs.$promises.$readFile('./package.json').catch(_catch).finally(_finally)
    expect(JSON.parse(content.toString()).name).toMatchInlineSnapshot(`"flowp"`)
    expect(_catch).toHaveBeenCalledTimes(0)
    expect(_finally).toHaveBeenCalledTimes(1)
  })

  it('should work with Promise.all', async () => {
    const then = vi.fn()
    const _catch = vi.fn()
    const _finally = vi.fn()
    await Promise.all([fs.$promises.$readFile('./package.json'), fs.$promises.$readFile('./package.json')])
      .then(then)
      .catch(_catch)
      .finally(_finally)
    expect(then).toHaveBeenCalledTimes(1)
    expect(_catch).toHaveBeenCalledTimes(0)
    expect(_finally).toHaveBeenCalledTimes(1)
  })

  it('should work with error', async () => {
    const then = vi.fn()
    const _catch = vi.fn()
    const _finally = vi.fn()
    await fs.$promises.$readFile('./some-non-existent-file').then(then).catch(_catch).finally(_finally)
    expect(then).toHaveBeenCalledTimes(0)
    expect(_catch).toHaveBeenCalledTimes(1)
    expect(_finally).toHaveBeenCalledTimes(1)
  })

  it('should work with function', async () => {
    const fn = (i: number) => i
    const delegated = delegate(Promise.resolve(fn))
    // `call` only exists on function prototype
    // @ts-ignore
    expect(await delegated.$call(null, 42)).toBe(42)
    expect(await delegated(777)).toBe(777)
  })

  it('work with instances that access private fields', async () => {
    expect(await objectWithPrivateField.$field).toBe(1)
    expect(await objectWithPrivateField.$fn()).toBe(1)
  })

  it('recursive delegate', async () => {
    expect(await deepObject.$a.$b).toBe(114514)
    expect(await deepObject.$a.$c.$deref()).toBe(await u)
    expect(await deepObject.$a.$d()).toMatchInlineSnapshot('"🐳"')
  })

  it('preserves this', async () => {
    class Foo {
      public constructor(public v: number) {
        this.v = v
      }
      public async foo() {
        return this
      }
      public bar() {
        return this.v
      }
    }
    const foo = new Foo(42)
    const delegated = delegate(Promise.resolve(foo))
    expect(await delegated.$foo()).toBe(foo)
    expect(await delegated.$bar()).toBe(42)
    const f = await delegated.$bar
    expect(Reflect.apply(f.bind({ v: 114514 }), null, [])).toBe(114514)
    expect(Reflect.apply(f, { v: 114514 }, [])).toBe(114514)
  })
})
