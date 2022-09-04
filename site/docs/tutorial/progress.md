---
sidebar_position: 3
title: Progress
---

import FlowP from '@site/src/theme/flowp'

## Overview

If you're writing a file downloader or task runner, you may want to display current progress to the end user. [Progress](#progress) helps you create a promise with progress reporting and listening / inspection.

## Class

```typescript
class Progress<Result = unknown, CurrentProgress = unknown> extends Future<Result>
```

Where:

`Result`: type of its fulfilled value, defaults to unknown

`CurrentProgress`: type of progress report, defaults to unknown

`Future<Result>`: Progress inherits all methods and properties from [Future](./future)

## Properties

### progress

```typescript
get progress(): CurrentProgress
```

Gets the current progress (last reported, despite current `progress` state)

## Methods

### constructor

```typescript
constructor(initialProgress: CurrentProgress)
```

Constructs a new Progress object with given initial progress.

### run

```typescript
static run<Result = unknown, CurrentProgress = unknown>(
  fn: (progress: Progress<Result, CurrentProgress>) => unknown,
  initialProgress: CurrentProgress
): Progress<Result, CurrentProgress>
```

A static helper method to create a new progress object, runs the given function with the progress as parameter, and returns the created progress object.

The function should report progress and call `progress.resolve` / `progress.reject` once done.

### report

```typescript
report(progress: CurrentProgress)
```

report current progress and notify all listeners, will have no effect if progress has already fulfilled or rejected.

### onProgress

```typescript
onProgress(listener: (progress: Readonly<CurrentProgress>) => unknown)
```

register a listener on progress report, and use the returned function to cancel listening.

### inspect

```typescript
inspect(): ProgressInspectionResult<Result, CurrentProgress>

type ProgressInspectionResult<Result, Progress> =
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
```

Inspects the progress, useful when debugging and it should only be used in debugging senarios.

## Examples

### resolve on all tasks finished

```typescript
const progress = new Progress<string, { current: number; total: number }>({ current: 0, total: 100 })

// automatically resolve when all tasks are finished
progress.onProgress((p) => p.current >= p.total && progress.resolve('banana!'))

progress.report({ current: 15, total: 100 })
progress.report({ current: 100, total: 100 })

expect(await progress).toBe('banana!')
```

### download progress with browser fetch

```typescript
const download => async (url) => {
  return Progress.run<number, number>((progress) => {
    const response = await fetch(url)
    const reader = response.body.getReader()
    // you may use 'Content-Length' header to detect total bytes to download and caculate a percentage
    // if the server supports

    // read chunks
    let received = 0
    let chunks = []
    while(true) {
      const { done, value } = await reader.read()
      if (done) break
    
      chunks.push(value)
      received += value.length
      progress.report(received)
    }
    
    // concatenate all chunks
    let data = new Uint8Array(received)
    let position = 0
    for(const chunk of chunks) {
      data.set(chunk, position)
      position += chunk.length
    }

    progress.resolve(new TextDecoder('utf-8').decode(data))
  }
}
```

assuming you're using React

```typescript
const DownloadProgress: React.FC<{ progress: Progress }> = ({ progress }) => {
  const [downloaded, setDownloaded] = useState(0)
  useEffect(() => {
    return progress.onProgress(setDownloaded)
  })

  return <p>{downloaded / (1024 * 1024 * 1024)} MiB downloaded.</p>
}
```