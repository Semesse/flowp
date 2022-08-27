import { vi, describe, it, expect } from 'vitest'
import { Progress } from './progress'

describe('progress', () => {
  it('can report progress and resolve', async () => {
    const progress = new Progress<number>(0)
    expect(progress.progress).toBe(0)

    const onProgress = vi.fn().mockImplementation((p) => p.current === 100 && progress.resolve(42))
    progress.onProgress(onProgress)

    const reports = [
      { current: 0, total: 100 },
      { current: 100, total: 100 },
    ]
    progress.report(reports[0])
    expect(progress.progress).toBe(reports[0])
    progress.report(reports[1])
    expect(onProgress).toHaveBeenNthCalledWith(1, reports[0])
    expect(onProgress).toHaveBeenNthCalledWith(2, reports[1])
    expect(await progress).toBe(42)
  })
})
