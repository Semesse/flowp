import { Mutex } from './mutex'

describe('mutex', () => {
  it('should be able to acquire', async () => {
    const mutex = new Mutex()
    const release = await mutex.acquire()
    expect(mutex.remain).toBe(0)
    release()
    expect(mutex.remain).toBe(1)
  })

  it('should release once', async () => {
    const mutex = new Mutex()
    const release = await mutex.acquire()
    expect(mutex.remain).toBe(0)
    release()
    expect(mutex.remain).toBe(1)
    release()
    expect(mutex.remain).toBe(1)
    expect(mutex.isFull).toBe(false)
    expect(mutex.isEmpty).toBe(true)
  })
})
