import { Mutex } from './mutex'

describe('mutex', () => {
  it('should be able to acquire', async () => {
    const mutex = new Mutex()
    const release = await mutex.acquire()
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
    const release = mutex.tryAcquire()
    expect(mutex.canLock).toBe(false)
    release()
    expect(mutex.canLock).toBe(true)
    release()
    expect(mutex.canLock).toBe(true)
  })
})
