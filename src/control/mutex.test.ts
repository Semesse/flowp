import { Mutex } from './mutex'

describe('mutex', () => {
  it('should be able to acquire', async () => {
    const mutex = new Mutex()
    const release = await mutex.acquire()
    expect(mutex.isFull).toBe(true)
    expect(mutex.isEmpty).toBe(false)
    release()
    expect(mutex.isFull).toBe(false)
    expect(mutex.isEmpty).toBe(true)
  })

  it('should release once', async () => {
    const mutex = new Mutex()
    const release = await mutex.acquire()
    release()
    release()
    expect(mutex.isFull).toBe(false)
    expect(mutex.isEmpty).toBe(true)
  })
})
