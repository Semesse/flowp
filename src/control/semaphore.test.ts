import { Semaphore, transfer } from './semaphore'
import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest'
import { timers } from '../promise'

describe('semaphore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'setTimeout')
  })
  afterEach(() => {
    vi.runAllTimers()
    vi.restoreAllMocks()
  })

  it.concurrent('should be able to acquire', async () => {
    const sem = new Semaphore()
    const release = await sem.acquire()
    expect(sem.remain).toBe(Infinity)
    release()
    expect(sem.remain).toBe(Infinity)
  })

  it.concurrent('should release once', async () => {
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

  it.concurrent('complex acquire', async () => {
    const permits = 5
    const sem = new Semaphore(permits)
    const release = await sem.acquire()
    sem.tryAcquire()
    const release2 = await sem.acquire()
    await sem.acquire()
    await sem.acquire()
    release()
    await sem.acquire()
    // will not release twice
    release()
    expect((async () => sem.tryAcquire())()).rejects.toThrowErrorMatchingInlineSnapshot(`"can't acquire semaphore"`)

    expect(sem.acquire(200)).rejects.toThrowErrorMatchingInlineSnapshot(`"timeout"`)
    expect(sem.acquire(-1)).rejects.toThrowErrorMatchingInlineSnapshot(`"timeout must be non negative"`)
    expect(sem.remain).toBe(0)
    vi.runAllTimers()
    expect(sem.isFull).toBe(true)
    expect(sem.isEmpty).toBe(false)
    expect(sem.remain).toBe(0)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200)

    expect(sem.acquire()).resolves.toBeDefined()
    setTimeout(release2, 200)
    vi.runAllTimers()
  })

  it.concurrent('should schedule task', async () => {
    const sem = new Semaphore(1)
    const task = vi.fn().mockImplementation((v: any) => v)
    expect(sem.schedule(() => task(1))).resolves.toBe(1)
    expect(sem.schedule(() => task(2))).resolves.toBe(2)
  })

  it.concurrent('should schedule task which throws', async () => {
    const sem = new Semaphore(1)
    const task = () => {
      throw new Error()
    }
    const promise = sem.schedule(task)
    expect(promise).rejects.toBeDefined()
    await promise.catch(() => {})
    expect(sem.remain).toBe(1)
  })

  it.concurrent('should schedule async task', async () => {
    const sem = new Semaphore(1)
    const task = vi.fn().mockImplementation((v: any) => Promise.resolve(v))
    expect(sem.schedule(() => task(1))).resolves.toBe(1)
    expect(sem.schedule(() => task(2))).resolves.toBe(2)
  })

  it.concurrent('should schedule async task which rejects', async () => {
    const sem = new Semaphore(1)
    const task = async () => {
      throw new Error()
    }
    const rejected = vi.fn()
    try {
      await sem.schedule(task)
    } catch (e) {
      rejected()
    }
    expect(sem.remain).toBe(1)
    expect(rejected).toBeCalledTimes(1)
  })

  it.concurrent('should be able to grant', async () => {
    const sem = new Semaphore(1)
    await sem.acquire()
    sem.grant(1)
    expect(sem.permits).toBe(2)
    expect(() => sem.grant(-1)).toThrowErrorMatchingInlineSnapshot(`"permits must be positive"`)

    expect(sem.acquire()).resolves.toBeDefined()
    await Promise.resolve()
  })

  it.concurrent('should be able to revoke', async () => {
    const sem = new Semaphore(1)
    await sem.revoke(1)
    expect(sem.permits).toBe(0)
    expect(sem.acquire(0)).rejects.toThrowErrorMatchingInlineSnapshot(`"timeout"`)
    expect(sem.acquire)

    expect(sem.revoke(-1)).rejects.toThrowErrorMatchingInlineSnapshot(`"permits must be positive"`)
  })

  it.concurrent('can revoke then grant again', async () => {
    const sem = new Semaphore(2)
    await sem.revoke(2)
    expect(sem.permits).toBe(0)
    sem.grant(1)
    expect(sem.permits).toBe(1)
    expect(sem.acquire()).resolves.toBeDefined()
  })

  it.concurrent('tryAcquire after freeze', async () => {
    const sem = new Semaphore(1)
    sem.freeze()
    expect(() => sem.tryAcquire()).toThrowError()
    expect(sem.remain).toBe(1)
    expect(sem.acquire(100)).rejects.toThrowErrorMatchingInlineSnapshot(`"timeout"`)

    vi.runAllTimers()
    await sem.unfreeze()
    expect(() => sem.tryAcquire()).not.toThrow()
    expect(sem.remain).toBe(0)
  })

  it.concurrent('acquire after freeze', async () => {
    const sem = new Semaphore(1)
    sem.freeze()
    expect(sem.acquire(100)).rejects.toThrowErrorMatchingInlineSnapshot('"timeout"')
    expect(() => sem.tryAcquire()).toThrow()
    expect(sem.remain).toBe(0)
    vi.runAllTimers()

    expect(sem.remain).toBe(1)
    await sem.unfreeze()

    expect(() => sem.tryAcquire()).not.toThrow()
    expect(sem.remain).toBe(0)
  })

  it.concurrent('acquire(queued) before freeze', async () => {
    const sem = new Semaphore(1)
    const release1 = sem.tryAcquire()
    sem.acquire()
    sem.freeze()
    expect(sem.remain).toBe(0)
    await sem.unfreeze()
    release1()
    expect(sem.remain).toBe(0)
    await Promise.resolve()
  })

  it.concurrent('unfreeze before freeze', async () => {
    const sem = new Semaphore(1)
    sem.unfreeze()
    expect(() => sem.tryAcquire()).not.toThrow()
    expect(sem.remain).toBe(0)
    expect(sem.acquire(100)).rejects.toMatchInlineSnapshot('[Error: timeout]')
    vi.runAllTimers()
  })

  it.concurrent('zero permits', () => {
    const sem = new Semaphore(0)
    expect(sem.remain).toBe(0)
    expect(sem.permits).toBe(0)
    expect(sem.isFull).toBe(true)
    expect(sem.isEmpty).toBe(true)
  })

  it.concurrent('grant and revoke infinity should work', async () => {
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

  it.concurrent('transfer permits between semaphores', async () => {
    const sem1 = new Semaphore(5)
    const sem2 = new Semaphore(1)
    const release1 = await sem1.acquire()
    const release2 = await sem2.acquire()
    const t = transfer(sem1, sem2, 5)
    expect(sem1.remain).toBe(0)
    expect(sem2.remain).toBe(0)
    expect(sem1.isFull).toBe(true)
    expect(sem1.permits).toBe(5)
    expect(sem2.permits).toBe(1)
    release1()
    release2()
    await t
    expect(sem1.permits).toBe(0)
    expect(sem2.permits).toBe(6)
  })

  it.concurrent('interrupt transfer', async () => {
    const sem1 = new Semaphore(1)
    const sem2 = new Semaphore(1)
    // exceed sem1's capacity so we can test if freeze can stop `revoke`
    const t = transfer(sem1, sem2, 5)
    sem1.freeze()

    expect(sem1.permits).toBe(1)
    expect(sem2.permits).toBe(1)
    expect(Promise.race([t, timers.timeout(100, new Error('timeout'))])).rejects.toThrow()

    sem1.grant(4)
    await sem1.unfreeze()
    await t

    expect(sem1.permits).toBe(0)
    expect(sem2.permits).toBe(6)
  })
})
