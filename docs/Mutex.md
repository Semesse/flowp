# Class: Mutex

## Table of contents

### Constructors

- [constructor](../wiki/Mutex#constructor)

### Properties

- [#semaphore](../wiki/Mutex##semaphore)

### Accessors

- [isEmpty](../wiki/Mutex#isempty)
- [isFull](../wiki/Mutex#isfull)

### Methods

- [acquire](../wiki/Mutex#acquire)

## Constructors

### constructor

• **new Mutex**()

#### Defined in

[src/control/mutex.ts:5](https://github.com/Semesse/flowp/blob/165e59c/src/control/mutex.ts#L5)

## Properties

### #semaphore

• `Private` **#semaphore**: [`Semaphore`](../wiki/Semaphore)

#### Defined in

[src/control/mutex.ts:4](https://github.com/Semesse/flowp/blob/165e59c/src/control/mutex.ts#L4)

## Accessors

### isEmpty

• `get` **isEmpty**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/control/mutex.ts:17](https://github.com/Semesse/flowp/blob/165e59c/src/control/mutex.ts#L17)

___

### isFull

• `get` **isFull**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/control/mutex.ts:13](https://github.com/Semesse/flowp/blob/165e59c/src/control/mutex.ts#L13)

## Methods

### acquire

▸ **acquire**(): `Promise`<() => `void`\>

#### Returns

`Promise`<() => `void`\>

#### Defined in

[src/control/mutex.ts:9](https://github.com/Semesse/flowp/blob/165e59c/src/control/mutex.ts#L9)
