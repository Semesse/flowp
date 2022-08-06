# Class: Channel<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Implements

- `PipeSource`<`T`\>
- `PipeTarget`<`T`\>

## Table of contents

### Constructors

- [constructor](../wiki/Channel#constructor)

### Properties

- [\_capacity](../wiki/Channel#_capacity)
- [closed](../wiki/Channel#closed)
- [pipeOptions](../wiki/Channel#pipeoptions)
- [pipeTarget](../wiki/Channel#pipetarget)
- [queue](../wiki/Channel#queue)
- [recvSem](../wiki/Channel#recvsem)
- [sendSem](../wiki/Channel#sendsem)
- [useSem](../wiki/Channel#usesem)

### Accessors

- [capacity](../wiki/Channel#capacity)

### Methods

- [[read]](../wiki/Channel#%5Bread%5D)
- [close](../wiki/Channel#close)
- [next](../wiki/Channel#next)
- [pipe](../wiki/Channel#pipe)
- [receive](../wiki/Channel#receive)
- [send](../wiki/Channel#send)
- [sendAsync](../wiki/Channel#sendasync)
- [stream](../wiki/Channel#stream)
- [tryReceive](../wiki/Channel#tryreceive)
- [trySend](../wiki/Channel#trysend)
- [unpipe](../wiki/Channel#unpipe)
- [writeValue](../wiki/Channel#writevalue)

## Constructors

### constructor

• **new Channel**<`T`\>(`capacity?`)

create a new multi-producer-single-consumer channel with specified capacity

**`Throws`**

capacity is negative or NaN

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `capacity` | `number` | `Infinity` | channel capacity, defaults to `Infinity` |

#### Defined in

[src/control/channel.ts:43](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L43)

## Properties

### \_capacity

• `Private` **\_capacity**: `number`

#### Defined in

[src/control/channel.ts:25](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L25)

___

### closed

• `Private` **closed**: `boolean` = `false`

#### Defined in

[src/control/channel.ts:24](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L24)

___

### pipeOptions

• `Private` `Optional` **pipeOptions**: `ChannelPipeOptions`

#### Defined in

[src/control/channel.ts:30](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L30)

___

### pipeTarget

• `Private` **pipeTarget**: ``null`` \| `PipeTarget`<`T`, `PipeSource`<`T`\>\> = `null`

#### Defined in

[src/control/channel.ts:29](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L29)

___

### queue

• `Private` **queue**: `T`[] = `[]`

#### Defined in

[src/control/channel.ts:26](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L26)

___

### recvSem

• `Private` **recvSem**: [`Semaphore`](../wiki/Semaphore)

#### Defined in

[src/control/channel.ts:28](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L28)

___

### sendSem

• `Private` **sendSem**: [`Semaphore`](../wiki/Semaphore)

#### Defined in

[src/control/channel.ts:27](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L27)

___

### useSem

• `Private` **useSem**: `boolean`

should use Semaphore to control max capacity,
`false` if capacity is Infinity

#### Defined in

[src/control/channel.ts:35](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L35)

## Accessors

### capacity

• `get` **capacity**(): `number`

#### Returns

`number`

#### Defined in

[src/control/channel.ts:152](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L152)

## Methods

### [read]

▸ **[read]**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`void`

#### Implementation of

PipeTarget.\_\_@read@457

#### Defined in

[src/control/channel.ts:119](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L119)

___

### close

▸ **close**(): `void`

close the channel, future `send` will throw a `ClosedChannelError`

#### Returns

`void`

#### Defined in

[src/control/channel.ts:148](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L148)

___

### next

▸ `Private` **next**(): `Promise`<`IteratorResult`<`T`, `undefined`\>\>

#### Returns

`Promise`<`IteratorResult`<`T`, `undefined`\>\>

#### Defined in

[src/control/channel.ts:174](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L174)

___

### pipe

▸ **pipe**(`target`, `options?`): `void`

pipe channel output to target

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `PipeTarget`<`T`, `PipeSource`<`T`\>\> |
| `options?` | `ChannelPipeOptions` |

#### Returns

`void`

#### Implementation of

PipeSource.pipe

#### Defined in

[src/control/channel.ts:132](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L132)

___

### receive

▸ **receive**(): `Promise`<`NonNullable`<`T`\>\>

retrieve a value from channel

will never resolve if [pipe](../wiki/Channel#pipe) or is enabled;
will race with [stream](../wiki/Channel#stream)
![img](file:///home/semesse/code/workspace/semlab/npkg/libsems/valcat.jpg)

#### Returns

`Promise`<`NonNullable`<`T`\>\>

#### Defined in

[src/control/channel.ts:71](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L71)

___

### send

▸ **send**(`value`): `Promise`<`void`\>

send a value to channel

**`Throws`**

throw if channel is closed

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/control/channel.ts:58](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L58)

___

### sendAsync

▸ **sendAsync**(`value`): `Promise`<`void`\>

send a promise to channel

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Promise`<`T`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/control/channel.ts:92](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L92)

___

### stream

▸ **stream**(): `ChannelStream`<`T`\>

get a stream to read from the channel, internally uses [receive](../wiki/Channel#receive)

#### Returns

`ChannelStream`<`T`\>

#### Defined in

[src/control/channel.ts:107](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L107)

___

### tryReceive

▸ **tryReceive**(): `undefined` \| `T`

try receive one message

#### Returns

`undefined` \| `T`

message `T` or `undefined` if no messages in the queue

#### Defined in

[src/control/channel.ts:100](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L100)

___

### trySend

▸ **trySend**(`value`): `void`

try to send a value synchronosly

**`Throws`**

channel is closed

**`Throws`**

channel is full

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`void`

#### Defined in

[src/control/channel.ts:83](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L83)

___

### unpipe

▸ **unpipe**(): `void`

unlink output with target, future input will be stored in channel's internal buffer

#### Returns

`void`

#### Implementation of

PipeSource.unpipe

#### Defined in

[src/control/channel.ts:140](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L140)

___

### writeValue

▸ `Private` **writeValue**(`value`): `void`

**SHOULD** check `capacity` and `closed` state before calling this method.

if check inside `writeValue`, there is a chance that `close` is called immediately after `send`
while writeValue is `asynchronosly` called in `send` and will unexpectedly throw an error

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`void`

#### Defined in

[src/control/channel.ts:162](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel.ts#L162)
