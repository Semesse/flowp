import { vi, describe, it, expect } from 'vitest'
import { Barrier } from './barrier'

describe('barrier', () => {
  it('should work', async () => {
    const barrier = new Barrier()
    const fn = vi.fn()
    expect(barrier.unlocked).toBe(false)
    expect(fn).toBeCalledTimes(0)
    barrier.unlock()
    barrier.then(fn)
    await barrier
    expect(barrier.unlocked).toBe(true)
    expect(fn).toBeCalledTimes(1)
  })
})
