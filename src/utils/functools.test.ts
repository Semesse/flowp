import { vi, describe, it, expect } from 'vitest'
import { once } from './functools'

describe('functools', () => {
  it('should be able to call once', () => {
    const fn = vi.fn()
    const onceFn = once(fn)
    onceFn()
    onceFn()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('subsequent calls to once when subsequent handler not provided', async () => {
    const mockValue = 42
    const fn = vi.fn().mockReturnValue(mockValue)
    const onced = once(fn)
    const first = onced()
    const succ = onced()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(first).toBe(mockValue)
    expect(succ).toBeUndefined()
  })

  it('subsequent calls to once when subsequent handler provided', async () => {
    const mockValue = 42
    const fn = vi.fn().mockReturnValue(mockValue)
    const handler = vi.fn().mockReturnValue(0)
    const onced = once(fn, handler)
    const first = onced()
    const succ = onced()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(first).toBe(mockValue)
    expect(succ).toBe(0)
    expect(handler).toBeCalledWith(mockValue)
  })
})
