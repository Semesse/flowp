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
    const task = vi.fn()
    mutex.schedule(task)
    await Promise.resolve()
    expect(task).toBeCalledTimes(1)
  })
})
