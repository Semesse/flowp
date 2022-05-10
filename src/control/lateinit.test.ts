import { Future } from './future'
import { lateinit } from './lateinit'

const tee = lateinit(new Promise<Console>((resolve) => setTimeout(() => resolve(console), 1000)))
const fs = lateinit(import('fs'))
const u = lateinit(Promise.resolve({ universe: { value: 42 } }))
const future = lateinit(new Future<number>())

describe('lateinit', () => {
  it('should not proxy other properties', async () => {
    // typescript does not support HKTs the return type is always `Promise`
    // @ts-ignore
    expect(future.resolve).toBe(Future.prototype.resolve)
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
})
