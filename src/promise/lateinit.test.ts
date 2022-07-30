import { Future } from './future'
import { lateinit } from './lateinit'

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
const tee = lateinit(
  new Promise<Console>((resolve) => {
    setTimeout(() => resolve(console), 1000)
  })
)
const fs = lateinit(import('fs'))
const u = lateinit(Promise.resolve({ universe: { value: 42 } }))
const objectWithPrivateField = lateinit(Promise.resolve(new PrivateClass()))

describe('lateinit', () => {
  it('should not proxy other properties', async () => {
    const v = new TestClass(() => 42)
    const delegated = lateinit(v)
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
    const _catch = jest.fn()
    const _finally = jest.fn()
    const content: Buffer = await fs.$promises.$readFile('./package.json').catch(_catch).finally(_finally)
    expect(JSON.parse(content.toString()).name).toMatchInlineSnapshot(`"flowp"`)
    expect(_catch).toHaveBeenCalledTimes(0)
    expect(_finally).toHaveBeenCalledTimes(1)
  })

  it('should work with Promise.all', async () => {
    const then = jest.fn()
    const _catch = jest.fn()
    const _finally = jest.fn()
    await Promise.all([fs.$promises.$readFile('./package.json'), fs.$promises.$readFile('./package.json')])
      .then(then)
      .catch(_catch)
      .finally(_finally)
    expect(then).toHaveBeenCalledTimes(1)
    expect(_catch).toHaveBeenCalledTimes(0)
    expect(_finally).toHaveBeenCalledTimes(1)
  })

  it('should work with error', async () => {
    const then = jest.fn()
    const _catch = jest.fn()
    const _finally = jest.fn()
    await fs.$promises.$readFile('./some-non-existent-file').then(then).catch(_catch).finally(_finally)
    expect(then).toHaveBeenCalledTimes(0)
    expect(_catch).toHaveBeenCalledTimes(1)
    expect(_finally).toHaveBeenCalledTimes(1)
  })

  it('work with instances that access private fields', async () => {
    expect(await objectWithPrivateField.$field).toBe(1)
    expect(await objectWithPrivateField.$fn()).toBe(1)
  })

  it('preserves this', async () => {
    class Foo {
      // eslint-disable-next-line @typescript-eslint/no-parameter-properties
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
    const delegated = lateinit(Promise.resolve(foo))
    expect(await delegated.$foo()).toBe(foo)
    expect(await delegated.$bar()).toBe(42)
    const f = await delegated.$bar
    expect(Reflect.apply(f.bind({ v: 114514 }), null, [])).toBe(114514)
    expect(Reflect.apply(f, { v: 114514 }, [])).toBe(114514)
  })
})
