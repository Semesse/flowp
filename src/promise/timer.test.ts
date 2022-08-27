import { vi, describe, it, expect, beforeAll } from 'vitest'
import { immediately, sleep, timeout } from './timer'

describe('timers', async () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('sleep', async () => {
    expect(sleep(100)).resolves.toBeUndefined()
    vi.runAllTimers()
  })

  it('timeout', async () => {
    expect(timeout(100, 'nihil')).rejects.toThrowErrorMatchingInlineSnapshot('"nihil"')
    vi.runAllTimers()
  })

  it('immediately', async () => {
    expect(immediately(42)).resolves.toBe(42)
    vi.runAllTimers()
  })
})
