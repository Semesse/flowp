import { vi, describe, it } from 'vitest'
import { Progress } from './progress'

describe('progress', () => {
  it('can report progress and resolve', async ({ expect }) => {
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

  it('progress.run', async ({ expect }) => {
    const prog = Progress.run((progress) => {
      progress.report(50)
      progress.resolve(100)
    }, 0)
    // last report
    expect(prog.progress).toBe(50)
    await expect(prog).resolves.toBe(100)
  })

  it('remove listener', async ({ expect }) => {
    const progress = new Progress<number>(0)
    const callback = vi.fn()
    const cancel = progress.onProgress(callback)
    progress.report(1)
    cancel()
    progress.report(2)
    expect(callback).toBeCalledTimes(1)
  })

  it('inspect progress', async ({ expect }) => {
    const progress = new Progress<number, number>(0)
    expect(progress.inspect()).toMatchInlineSnapshot(`
      {
        "progress": 0,
        "state": "pending",
      }
    `)
    progress.report(12)
    expect(progress.inspect()).toMatchInlineSnapshot(`
      {
        "progress": 12,
        "state": "pending",
      }
    `)
    progress.resolve(Infinity)
    expect(progress.inspect()).toMatchInlineSnapshot(`
      {
        "state": "fulfilled",
        "value": Infinity,
      }
    `)

    const progress2 = new Progress<number, number>(0)
    const err = new Error('rejected')
    progress2.reject(err)
    expect(progress2.inspect()).toMatchInlineSnapshot(`
      {
        "reason": [Error: rejected],
        "state": "rejected",
      }
    `)
  })
})
