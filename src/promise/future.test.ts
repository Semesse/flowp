import EventEmitter from 'node:events'
import { vi } from 'vitest'
import { Future } from './future'

describe('future', () => {
  it('should resolve', async () => {
    const future = new Future<number>()
    future.resolve(42)
    expect(await future).toBe(42)
  })

  it('should reject', async () => {
    const future = new Future<number>()
    future.reject(new Error('test'))
    await expect(future).rejects.toThrow('test')
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
})
