import { vi, describe, it, beforeAll } from 'vitest'
import { immediately, sleep, timeout } from './timer'

describe('timers', async () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('sleep', async ({ expect }) => {
    const err = new Error('snooze')
    const sleep1 = sleep(100)
    const sleep2 = sleep(100, err)
    vi.runAllTimers()
    await expect(sleep1).resolves.toBeUndefined()
    await expect(sleep2).resolves.toBe(err)
  })

  it('timeout', async ({ expect }) => {
    const promise = timeout(100, 'nihil')
    vi.runAllTimers()
    await expect(promise).rejects.toThrowErrorMatchingInlineSnapshot('"nihil"')
  })

  it('immediately', async ({ expect }) => {
    const promise = immediately(42)
    vi.runAllTimers()
    await expect(promise).resolves.toBe(42)
  })
})
