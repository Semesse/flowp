import { Future } from './future'

export type ProgressInspectionResult<Result, Progress> =
  | {
      state: 'pending'
      progress: Progress
    }
  | {
      state: 'fulfilled'
      value: Result
    }
  | {
      state: 'rejected'
      reason: unknown
    }

/**
 * Create a promise, but with progress reporting
 *
 * @beta
 * @typeParam Result - type of the progress's fulfilled value
 * @typeParam CurrentProgress - type of current progress used in p.report or p.progress
 */
export class Progress<Result = unknown, CurrentProgress = unknown> extends Future<Result> {
  /**
   * creates a new progress object and runs the given function with the progress as parameter,
   * returns the created progress object.
   *
   * the function should report progress and call `progress.resolve` / `progress.reject` once done.
   *
   * @example
   * Progress.run((progress) => {
   *   progress.report(100)
   *   progress.resolve('hello')
   * }, 0)
   */
  public static run<Result = unknown, CurrentProgress = unknown>(
    fn: (progress: Progress<Result, CurrentProgress>) => unknown,
    initialProgress: CurrentProgress
  ): Progress<Result, CurrentProgress> {
    const progress = new Progress<Result, CurrentProgress>(initialProgress)
    fn(progress)
    return progress
  }

  private currentProgress: CurrentProgress
  private listeners: Set<(progress: CurrentProgress) => unknown> = new Set()

  /**
   * create a promise, but with progress reporting.
   */
  public constructor(initialProgress: CurrentProgress) {
    super()
    this.currentProgress = initialProgress
  }

  /**
   * get last reported progress (despite current progress state)
   */
  public get progress(): CurrentProgress {
    return this.currentProgress
  }

  /**
   * inspect the current progress, for debug purpose only.
   */
  public inspect(): ProgressInspectionResult<Result, CurrentProgress> {
    return this.pending
      ? {
          state: 'pending',
          progress: this.currentProgress,
        }
      : this.fulfilled
      ? {
          state: 'fulfilled',
          value: this.settledValue as Result,
        }
      : {
          state: 'rejected',
          reason: this.settledValue,
        }
  }

  /**
   * register a listener on progress report, and use the returned function to cancel listening.
   *
   * listeners won't receive messages on progress rejection
   */
  public onProgress(listener: (progress: Readonly<CurrentProgress>) => unknown) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * report current progress, will have no effect if progress has already fulfilled or rejected.
   */
  public report(progress: CurrentProgress) {
    if (!this.pending) return
    this.currentProgress = progress
    this.listeners.forEach((callback) => callback(progress))
  }
}
