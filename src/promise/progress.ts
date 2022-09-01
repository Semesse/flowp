import { Future } from './future'

/**
 * Create a promise, but with progress reporting
 *
 * @alpha not finalized
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class Progress<Result = void, ProgressInfo = unknown> extends Future<Result> {
  private currentProgress: ProgressInfo
  private listeners: Set<(progress: ProgressInfo) => unknown> = new Set()

  /**
   * Create a promise, but with progress reporting
   */
  public constructor(initialProgress: ProgressInfo) {
    super()
    this.currentProgress = initialProgress
  }

  /**
   * get current progress
   *
   * @throws err if progress has rejected
   */
  public get progress(): ProgressInfo | undefined {
    return this.currentProgress
  }

  /**
   * register a listener on progress
   *
   * @throws err if progress has rejected
   */
  public onProgress(listener: (progress: Readonly<ProgressInfo>) => unknown) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  public report(progress: ProgressInfo) {
    this.currentProgress = progress
    this.listeners.forEach((callback) => callback(progress))
  }

  public override get reject(): (error?: unknown) => void {
    return (error) => this._reject(error)
  }
}
