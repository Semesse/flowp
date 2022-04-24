import { noExit } from './no_exit'
import { Semaphore } from './semaphore'

describe('semaphore', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
  })

  it('should be able to acquire', async () => {
    const sem = new Semaphore()
    const release = await sem.acquire()
    expect(sem.remain).toBe(Infinity)
    release()
    expect(sem.remain).toBe(Infinity)
  })

  it('should release once', async () => {
    const sem = new Semaphore(5)
    const release = await sem.acquire()
    expect(sem.remain).toBe(4)
    release()
    expect(sem.remain).toBe(5)
    release()
    expect(sem.remain).toBe(5)
    expect(sem.isFull).toBe(false)
    expect(sem.isEmpty).toBe(true)
  })

  it('should be able to acquire', async () => {
    const sem = new Semaphore(5)
    const release = await sem.acquire()
    sem.tryAcquire()
    const release2 = await sem.acquire()
    await sem.acquire()
    await sem.acquire()
    release()
    await sem.acquire()
    // will not release
    release()
    expect((async () => sem.tryAcquire())()).rejects.toThrow()

    expect(sem.acquire(200)).rejects.toThrow('timeout')
    expect(sem.remain).toBe(0)
    jest.runOnlyPendingTimers()
    expect(sem.isFull).toBe(true)
    expect(sem.isEmpty).toBe(false)
    expect(sem.remain).toBe(0)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200)

    expect(sem.acquire()).resolves.toBeUndefined()
    setTimeout(release2, 200)
  })
})
