import { noExit } from './no_exit'
import { Semaphore, transfer } from './semaphore'

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
    const permits = 5
    const sem = new Semaphore(permits)
    expect(sem.permits).toBe(permits)
    const release = await sem.acquire()
    expect(sem.remain).toBe(permits - 1)
    release()
    expect(sem.remain).toBe(permits)
    release()
    expect(sem.remain).toBe(permits)
    expect(sem.isFull).toBe(false)
    expect(sem.isEmpty).toBe(true)
  })

  it('should be able to acquire', async () => {
    const permits = 5
    const sem = new Semaphore(permits)
    const release = await sem.acquire()
    sem.tryAcquire()
    const release2 = await sem.acquire()
    await sem.acquire()
    await sem.acquire()
    release()
    await sem.acquire()
    // will not release
    release()
    expect((async () => sem.tryAcquire())()).rejects.toThrowErrorMatchingInlineSnapshot(`"can't acquire semaphore"`)

    expect(sem.acquire(200)).rejects.toThrowErrorMatchingInlineSnapshot(`"timeout"`)
    expect(sem.acquire(-1)).rejects.toThrowErrorMatchingInlineSnapshot(`"timeout must be valid"`)
    expect(sem.remain).toBe(0)
    jest.runAllTimers()
    expect(sem.isFull).toBe(true)
    expect(sem.isEmpty).toBe(false)
    expect(sem.remain).toBe(0)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200)

    expect(sem.acquire()).resolves.toBeUndefined()
    setTimeout(release2, 200)
  })

  it('should be able to grant', async () => {
    const sem = new Semaphore(1)
    await sem.acquire()
    sem.grant(1)
    expect(sem.permits).toBe(2)
    expect(() => sem.grant(-1)).toThrowErrorMatchingInlineSnapshot(`"permits must be positive"`)

    return expect(sem.acquire()).resolves.toBeDefined()
  })

  it('should be able to revoke', async () => {
    const sem = new Semaphore(1)
    const release = await sem.acquire()
    await sem.revoke(1)
    expect(sem.permits).toBe(0)
    expect(sem.acquire(0)).rejects.toThrowErrorMatchingInlineSnapshot(`"timeout"`)
    jest.runAllTimers()

    expect(sem.revoke(1)).rejects.toThrowErrorMatchingInlineSnapshot(`"does not have that much permits"`)
    expect(sem.revoke(-1)).rejects.toThrowErrorMatchingInlineSnapshot(`"permits must be positive"`)
  })

  it('grant and revoke infinity should work', async () => {
    const sem = new Semaphore()
    const release = await sem.acquire()
    sem.grant(Infinity)
    expect(sem.remain).toBe(Infinity)
    expect(sem.permits).toBe(Infinity)
    await sem.revoke(Infinity)
    expect(sem.remain).toBe(0)
    release()
    expect(sem.remain).toBe(0)
  })

  it('transfer permits between semaphores', async () => {
    const sem1 = new Semaphore(1)
    const sem2 = new Semaphore(1)
    const release1 = await sem1.acquire()
    const release2 = await sem2.acquire()
    const t = transfer(sem1, sem2, 1)
    expect(sem1.remain).toBe(0)
    expect(sem2.remain).toBe(0)
    expect(sem1.isFull).toBe(true)
    expect(sem1.permits).toBe(0)
    expect(sem2.permits).toBe(1)
    release1()
    release2()
    await t
    expect(sem1.permits).toBe(0)
    expect(sem2.permits).toBe(2)
  })
})
