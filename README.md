# flowp

![](https://img.shields.io/github/workflow/status/Semesse/flowp/Run%20tests/master?label=CI&style=flat-square)
![](https://img.shields.io/codeclimate/maintainability/Semesse/flowp?style=flat-square)
![](https://img.shields.io/codeclimate/coverage/Semesse/flowp?style=flat-square)

flowp is a promise based utility library, providing asynchronos components like



- **Semaphore / Mutex**: controls max concurrency
- **Channel**: multi producer single comsumer channel
- **Future**: Promise that can be resolved anywhere other than where it's defined
- **lateinit**: delegate method calls and property accesses to fullfiled value of Promises