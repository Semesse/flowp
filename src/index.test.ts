import * as flowp from '.'
import { describe, it, expect } from 'vitest'

describe('exports', () => {
  // to ensure nothing is mistakenly exported
  it('exported members', () => {
    expect(flowp).toMatchInlineSnapshot(`
      {
        "Channel": [Function],
        "ChannelHub": [Function],
        "Future": [Function],
        "Mutex": [Function],
        "Progress": [Function],
        "Semaphore": [Function],
        "delegate": [Function],
        "pipe": {
          "Transform": [Function],
          "read": Symbol(pipeable),
          "to": [Function],
        },
        "timers": {
          "immediately": [Function],
          "sleep": [Function],
          "timeout": [Function],
        },
      }
    `)
  })
})
