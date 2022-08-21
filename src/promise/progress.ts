import { Future } from './future'

export class Progress<Result, ProgressInfo = unknown> extends Future<Result> {
  private currentProgress: ProgressInfo
  private listeners: Set<(progress: ProgressInfo) => unknown> = new Set()

  public constructor(initialProgress: ProgressInfo) {
    super()
    this.currentProgress = initialProgress
  }

  /**
   * get current progress
   */
  public get progress(): ProgressInfo | undefined {
    return this.currentProgress
  }

  public onProgress(listener: (progress: Readonly<ProgressInfo>) => unknown) {
    this.listeners.add(listener)
  }

  public report(progress: ProgressInfo) {
    this.currentProgress = progress
    this.listeners.forEach((callback) => callback(progress))
  }
}
