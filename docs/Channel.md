# Class: Channel<T\>

a pipe source should be able to write its output to a pipe target

## Type parameters

| Name |
| :------ |
| `T` |

## Implements

- [`PipeSource`](../wiki/pipe.PipeSource)<`T`\>
- [`PipeTarget`](../wiki/pipe.PipeTarget)<`T`\>

## Table of contents

### Constructors

- [constructor](../wiki/Channel#constructor)

### Properties

- [#capacity](../wiki/Channel##capacity)
- [#closed](../wiki/Channel##closed)
- [#pipeTarget](../wiki/Channel##pipetarget)
- [#queue](../wiki/Channel##queue)
- [#recvSem](../wiki/Channel##recvsem)
- [#sendSem](../wiki/Channel##sendsem)
- [#useSem](../wiki/Channel##usesem)

### Accessors

- [capacity](../wiki/Channel#capacity)

### Methods

- [#next](../wiki/Channel##next)
- [[read]](../wiki/Channel#%5Bread%5D)
- [close](../wiki/Channel#close)
- [pipe](../wiki/Channel#pipe)
- [receive](../wiki/Channel#receive)
- [send](../wiki/Channel#send)
- [sendAsync](../wiki/Channel#sendasync)
- [stream](../wiki/Channel#stream)
- [tryReceive](../wiki/Channel#tryreceive)
- [trySend](../wiki/Channel#trysend)
- [unpipe](../wiki/Channel#unpipe)

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

[src/control/channel.ts:29](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L29)

## Properties

### #capacity

• `Private` **#capacity**: `number`

#### Defined in

[src/control/channel.ts:14](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L14)

___

### #closed

• `Private` **#closed**: `boolean` = `false`

#### Defined in

[src/control/channel.ts:13](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L13)

___

### #pipeTarget

• `Private` **#pipeTarget**: ``null`` \| [`PipeTarget`](../wiki/pipe.PipeTarget)<`T`, [`PipeSource`](../wiki/pipe.PipeSource)<`T`\>\> = `null`

#### Defined in

[src/control/channel.ts:18](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L18)

___

### #queue

• `Private` **#queue**: `T`[] = `[]`

#### Defined in

[src/control/channel.ts:15](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L15)

___

### #recvSem

• `Private` **#recvSem**: [`Semaphore`](../wiki/Semaphore)

#### Defined in

[src/control/channel.ts:17](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L17)

___

### #sendSem

• `Private` **#sendSem**: [`Semaphore`](../wiki/Semaphore)

#### Defined in

[src/control/channel.ts:16](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L16)

___

### #useSem

• `Private` **#useSem**: `boolean`

should use Semaphore to control max capacity,
`false` if capacity is Infinity

#### Defined in

[src/control/channel.ts:23](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L23)

## Accessors

### capacity

• `get` **capacity**(): `number`

#### Returns

`number`

#### Defined in

[src/control/channel.ts:100](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L100)

## Methods

### #next

▸ `Private` **#next**(): `Promise`<`IteratorResult`<`T`, `undefined`\>\>

#### Returns

`Promise`<`IteratorResult`<`T`, `undefined`\>\>

#### Defined in

[src/control/channel.ts:104](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L104)

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

PipeTarget.\_\_@read@177

#### Defined in

[src/control/channel.ts:84](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L84)

___

### close

▸ **close**(): `void`

#### Returns

`void`

#### Defined in

[src/control/channel.ts:96](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L96)

___

### pipe

▸ **pipe**(`target`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`PipeTarget`](../wiki/pipe.PipeTarget)<`T`, [`PipeSource`](../wiki/pipe.PipeSource)<`T`\>\> |

#### Returns

`void`

#### Implementation of

PipeSource.pipe

#### Defined in

[src/control/channel.ts:88](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L88)

___

### receive

▸ **receive**(): `Promise`<`NonNullable`<`T`\>\>

#### Returns

`Promise`<`NonNullable`<`T`\>\>

#### Defined in

[src/control/channel.ts:49](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L49)

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

[src/control/channel.ts:39](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L39)

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

[src/control/channel.ts:60](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L60)

___

### stream

▸ **stream**(): `ChannelStream`<`T`\>

#### Returns

`ChannelStream`<`T`\>

#### Defined in

[src/control/channel.ts:72](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L72)

___

### tryReceive

▸ **tryReceive**(): `undefined` \| `T`

try receive one message

#### Returns

`undefined` \| `T`

message `T` or `undefined` if no messages in the queue

#### Defined in

[src/control/channel.ts:68](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L68)

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

[src/control/channel.ts:55](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L55)

___

### unpipe

▸ **unpipe**(): `void`

#### Returns

`void`

#### Implementation of

PipeSource.unpipe

#### Defined in

[src/control/channel.ts:92](https://github.com/Semesse/flowp/blob/165e59c/src/control/channel.ts#L92)
