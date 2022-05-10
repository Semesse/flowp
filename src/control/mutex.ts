import { Semaphore } from './semaphore'

export class Mutex {
  #semaphore: Semaphore
  public constructor() {
    this.#semaphore = new Semaphore(1)
  }

  public async acquire() {
    return await this.#semaphore.acquire()
  }

  public get isFull() {
    return this.#semaphore.isFull
  }

  public get isEmpty() {
    return this.#semaphore.isEmpty
  }
}
