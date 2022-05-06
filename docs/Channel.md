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

- [constructor](../wiki/Channel#constructor-1)

### Properties

- [#capacity](../wiki/Channel##capacity-1)
- [#closed](../wiki/Channel##closed-1)
- [#pipeTarget](../wiki/Channel##pipetarget-1)
- [#queue](../wiki/Channel##queue-1)
- [#recvSem](../wiki/Channel##recvsem-1)
- [#sendSem](../wiki/Channel##sendsem-1)

### Accessors

- [capacity](../wiki/Channel#capacity-1)

### Methods

- [#next](../wiki/Channel##next-1)
- [[read]](../wiki/Channel#%5Bread%5D-1)
- [close](../wiki/Channel#close-1)
- [pipe](../wiki/Channel#pipe-1)
- [receive](../wiki/Channel#receive-1)
- [send](../wiki/Channel#send-1)
- [sendAsync](../wiki/Channel#sendasync-1)
- [stream](../wiki/Channel#stream-1)
- [tryReceive](../wiki/Channel#tryreceive-1)
- [trySend](../wiki/Channel#trysend-1)
- [unpipe](../wiki/Channel#unpipe-1)

## Constructors

### constructor

• **new Channel**<`T`\>(`capacity?`)

create a new multi-producer-single-consumer channel with specified capacity

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `capacity` | `number` | `Infinity` | channel capacity, defaults to `Infinity` |

#### Defined in

[src/control/channel.ts:24](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L24)

## Properties

### #capacity

• `Private` **#capacity**: `number`

#### Defined in

[src/control/channel.ts:14](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L14)

___

### #closed

• `Private` **#closed**: `boolean` = `false`

#### Defined in

[src/control/channel.ts:13](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L13)

___

### #pipeTarget

• `Private` **#pipeTarget**: ``null`` \| `PipeTarget`<`T`\> = `null`

#### Defined in

[src/control/channel.ts:18](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L18)

___

### #queue

• `Private` **#queue**: `T`[] = `[]`

#### Defined in

[src/control/channel.ts:15](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L15)

___

### #recvSem

• `Private` **#recvSem**: [`Semaphore`](../wiki/Semaphore)

#### Defined in

[src/control/channel.ts:17](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L17)

___

### #sendSem

• `Private` **#sendSem**: [`Semaphore`](../wiki/Semaphore)

#### Defined in

[src/control/channel.ts:16](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L16)

## Accessors

### capacity

• `get` **capacity**(): `number`

#### Returns

`number`

#### Defined in

[src/control/channel.ts:95](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L95)

## Methods

### #next

▸ `Private` **#next**(): `Promise`<`IteratorResult`<`T`, `undefined`\>\>

#### Returns

`Promise`<`IteratorResult`<`T`, `undefined`\>\>

#### Defined in

[src/control/channel.ts:99](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L99)

___

### [read]

▸ **[read]**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`void`

#### Implementation of

PipeTarget.\_\_@read@347

#### Defined in

[src/control/channel.ts:79](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L79)

___

### close

▸ **close**(): `void`

#### Returns

`void`

#### Defined in

[src/control/channel.ts:91](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L91)

___

### pipe

▸ **pipe**(`target`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `PipeTarget`<`T`\> |

#### Returns

`void`

#### Implementation of

PipeSource.pipe

#### Defined in

[src/control/channel.ts:83](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L83)

___

### receive

▸ **receive**(): `Promise`<`NonNullable`<`T`\>\>

#### Returns

`Promise`<`NonNullable`<`T`\>\>

#### Defined in

[src/control/channel.ts:43](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L43)

___

### send

▸ **send**(`value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/control/channel.ts:33](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L33)

___

### sendAsync

▸ **sendAsync**(`value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Promise`<`T`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/control/channel.ts:54](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L54)

___

### stream

▸ **stream**(): `ChannelStream`<`T`\>

#### Returns

`ChannelStream`<`T`\>

#### Defined in

[src/control/channel.ts:66](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L66)

___

### tryReceive

▸ **tryReceive**(): `undefined` \| `T`

try receive one message

#### Returns

`undefined` \| `T`

message `T` or `undefined` if no messages in the queue

#### Defined in

[src/control/channel.ts:62](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L62)

___

### trySend

▸ **trySend**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`void`

#### Defined in

[src/control/channel.ts:49](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L49)

___

### unpipe

▸ **unpipe**(): `void`

#### Returns

`void`

#### Implementation of

PipeSource.unpipe

#### Defined in

[src/control/channel.ts:87](https://github.com/Semesse/flowp/blob/5067796/src/control/channel.ts#L87)