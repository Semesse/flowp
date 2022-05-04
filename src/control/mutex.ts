import { Semaphore } from './semaphore'

export class Mutex {
  #semaphore: Semaphore
  constructor() {
    this.#semaphore = new Semaphore(1)
  }

  async acquire() {
    return await this.#semaphore.acquire()
  }

  get isFull() {
    return this.#semaphore.isFull
  }

  get isEmpty() {
    return this.#semaphore.isEmpty
  }
}
