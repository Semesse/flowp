import { vi, describe, it, expect } from 'vitest'
import { timers } from '../promise'
import { Mutex } from './mutex'

describe('mutex', () => {
  it('should be able to lock', async () => {
    const mutex = new Mutex()
    const release = await mutex.lock()
    expect(mutex.canLock).toBe(false)
    release()
    expect(mutex.canLock).toBe(true)
  })

  it('should release once', async () => {
    const mutex = new Mutex()
    const release = await mutex.lock()
    release()
    release()
    expect(mutex.canLock).toBe(true)
  })

  it('try acquire', async () => {
    const mutex = new Mutex()
    const release = mutex.tryLock()
    expect(mutex.canLock).toBe(false)
    release()
    expect(mutex.canLock).toBe(true)
    release()
    expect(mutex.canLock).toBe(true)
  })

  it('should freeze', async () => {
    const mutex = new Mutex()
    expect(mutex.frozen).toBe(false)
    mutex.freeze()
    expect(mutex.canLock).toBe(false)
    expect(mutex.frozen).toBe(true)
    expect(Promise.race([mutex.lock(), timers.timeout(100)])).rejects.toThrow()
  })

  it('should unfreeze', async () => {
    const mutex = new Mutex()
    mutex.freeze()
    expect(mutex.canLock).toBe(false)
    await mutex.unfreeze()
    expect(mutex.canLock).toBe(true)
    expect(mutex.tryLock).toBeTruthy()
  })

  it('should schedule', async () => {
    const mutex = new Mutex()
    const task = vi.fn().mockImplementation(() => 42)
    expect(await mutex.schedule(task)).toBe(42)
    expect(task).toBeCalledTimes(1)
  })

  it('scheduled task rejected', async () => {
    const mutex = new Mutex()
    const task = async () => {
      throw new Error('failed')
    }
    const rejectHandler = vi.fn()
    await mutex.schedule(task).catch(rejectHandler)
    expect(mutex.canLock).toBe(true)
    expect(rejectHandler).toBeCalledTimes(1)
  })

  it('wrap an object', async () => {
    const mutex = new Mutex({ a: 1 })
    await mutex.schedule((v) => {
      expect(v.a).toBe(1)
    })
    const { release, value } = mutex.tryLock()
    expect(value.a).toBe(1)
    release()
    expect(() => value.a).toThrowErrorMatchingInlineSnapshot(
      '"Cannot perform \'get\' on a proxy that has been revoked"'
    )
    expect(mutex.canLock).toBe(true)
  })

  // it.skip('[ES2022] wrap an object with private field', async () => {
  //   const v = new (class {
  //     #a = 1
  //     public get a() {
  //       return this.#a
  //     }
  //     public set a(v: number) {
  //       this.#a = v
  //     }
  //   })()
  //   const mutex = new Mutex(v)
  //   await mutex.schedule((v) => {
  //     expect(v.a).toBe(1)
  //     v.a = 2
  //     expect(v.a).toBe(2)
  //   })
  //   const { release, value } = mutex.tryLock()
  //   expect(value.a).toBe(2)
  //   release()
  //   expect(() => value.a).toThrowError("Cannot perform 'get' on a proxy that has been revoked")
  //   expect(mutex.canLock).toBe(true)
  // })
})
