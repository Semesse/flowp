# Class: ChannelHub<T\>

compose multiple channels into one

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

## Implements

- `PipeTarget`<`T`\>

## Table of contents

### Constructors

- [constructor](../wiki/ChannelHub#constructor)

### Properties

- [readers](../wiki/ChannelHub#readers)
- [writers](../wiki/ChannelHub#writers)

### Methods

- [[read]](../wiki/ChannelHub#%5Bread%5D)
- [broadcast](../wiki/ChannelHub#broadcast)
- [close](../wiki/ChannelHub#close)
- [reader](../wiki/ChannelHub#reader)
- [writer](../wiki/ChannelHub#writer)
- [from](../wiki/ChannelHub#from)

## Constructors

### constructor

• **new ChannelHub**<`T`\>(`writers?`, `readers?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `writers?` | [`Channel`](../wiki/Channel)<`T`\>[] |
| `readers?` | [`Channel`](../wiki/Channel)<`T`\>[] |

#### Defined in

[src/control/channel_hub.ts:16](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel_hub.ts#L16)

## Properties

### readers

• `Private` **readers**: [`Channel`](../wiki/Channel)<`T`\>[]

#### Defined in

[src/control/channel_hub.ts:13](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel_hub.ts#L13)

___

### writers

• `Private` **writers**: [`Channel`](../wiki/Channel)<`T`\>[]

#### Defined in

[src/control/channel_hub.ts:14](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel_hub.ts#L14)

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

[src/control/channel_hub.ts:50](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel_hub.ts#L50)

___

### broadcast

▸ **broadcast**(`value`): `void`

send a valut to the hub, will be received by all readers or pipe target

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`void`

#### Defined in

[src/control/channel_hub.ts:26](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel_hub.ts#L26)

___

### close

▸ **close**(): `void`

#### Returns

`void`

#### Defined in

[src/control/channel_hub.ts:54](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel_hub.ts#L54)

___

### reader

▸ **reader**(): [`Channel`](../wiki/Channel)<`T`\>

get a reader channel that can get messages from channel hub
you can only use one of pipe or readers at the same time

#### Returns

[`Channel`](../wiki/Channel)<`T`\>

#### Defined in

[src/control/channel_hub.ts:34](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel_hub.ts#L34)

___

### writer

▸ **writer**(): [`Channel`](../wiki/Channel)<`T`\>

get a writer channel that can send messages to channel hub

#### Returns

[`Channel`](../wiki/Channel)<`T`\>

#### Defined in

[src/control/channel_hub.ts:43](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel_hub.ts#L43)

___

### from

▸ `Static` **from**<`T`\>(`writers?`, `readers?`): [`ChannelHub`](../wiki/ChannelHub)<`T`\>

a helper function, equivalant to ChannelHub.constructor

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `writers?` | [`Channel`](../wiki/Channel)<`T`\>[] |
| `readers?` | [`Channel`](../wiki/Channel)<`T`\>[] |

#### Returns

[`ChannelHub`](../wiki/ChannelHub)<`T`\>

#### Defined in

[src/control/channel_hub.ts:9](https://github.com/Semesse/flowp/blob/49faea8/src/control/channel_hub.ts#L9)
