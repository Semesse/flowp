import { vi, describe, it, expect } from 'vitest'
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
})
