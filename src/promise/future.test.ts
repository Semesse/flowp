import EventEmitter from 'node:events'
import { vi, describe, it, expect } from 'vitest'
import { Future } from './future'

describe('future', () => {
  it('should resolve', async () => {
    const future = new Future<number>()
    future.resolve(42)
    const fn = vi.fn()
    const fn2 = vi.fn()
    future.then(fn)
    future.then(fn2)
    expect(await future).toBe(42)
    expect(fn).toBeCalledWith(42)
    expect(fn2).toBeCalledTimes(1)
  })

  it('should reject', async () => {
    const future = new Future<number>()
    const fn = vi.fn()
    const fn2 = vi.fn()
    const err = new Error('test')
    future.catch(fn)
    future.catch(fn2)
    future.reject(err)
    await expect(future).rejects.toThrow('test')
    expect(fn).toBeCalledWith(err)
    expect(fn2).toBeCalledTimes(1)
  })

  it('should finally', async () => {
    const fin = vi.fn()
    const future = new Future<number>()
    future.resolve(42)
    await future.finally(fin)
    expect(fin).toBeCalledTimes(1)
  })

  it('should work with EventEmitter with bound resolve', async () => {
    const future = new Future<number>()
    const emitter = new EventEmitter()
    emitter.on('test', future.resolve)
    emitter.emit('test', 42)
    expect(await future).toBe(42)
  })

  it('should not resolve more than once', async () => {
    const future = new Future<number>()
    future.resolve(42)
    future.resolve(37)
    expect(await future).toBe(42)
  })

  it('should not reject more than once', async () => {
    const future = new Future<number>()
    future.reject(42)
    future.reject(37)
    expect(future).rejects.toBe(42)
  })

  it('should not resolve or reject more than once', async () => {
    const future = new Future<number>()
    future.resolve(42)
    future.reject(37)
    expect(await future).toBe(42)
  })

  it('fulfill state', async () => {
    const future = new Future<number>()
    expect(future.pending).toBe(true)
    expect(future.fulfilled).toBe(false)
    expect(future.rejected).toBe(false)
    future.resolve(42)
    expect(future.pending).toBe(false)
    expect(future.fulfilled).toBe(true)
    expect(future.rejected).toBe(false)
    future.reject(42)
    expect(future.pending).toBe(false)
    expect(future.fulfilled).toBe(true)
    expect(future.rejected).toBe(false)

    const future2 = new Future<number>()
    future2.catch(() => {})
    future2.reject(new Error('XXD'))
    expect(future2.pending).toBe(false)
    expect(future2.fulfilled).toBe(false)
    expect(future2.rejected).toBe(true)
  })

  it('inspect settled result, pending', () => {
    const future = new Future<number>()
    expect(future.settled).toBe(undefined)
  })

  it('inspect settled result, fulfilled', () => {
    const future = new Future<number>()
    future.resolve(42)
    expect(future.settled).toBe(42)
  })

  it('inspect settled result, rejected', () => {
    const future = new Future<number>()
    const err = new Error('canceled')
    future.reject(err)
    expect(future.settled).toBe(err)
  })
})
