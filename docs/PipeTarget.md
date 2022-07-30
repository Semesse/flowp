# Interface: PipeTarget<T, S\>

a pipe target can receive data from a pipe source

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | [`PipeSource`](../wiki/PipeSource)<`T`\> |

## Hierarchy

- **`PipeTarget`**

  ↳ [`Pipe`](../wiki/Pipe)

## Implemented by

- [`Channel`](../wiki/Channel)
- [`ChannelHub`](../wiki/ChannelHub)
- [`PipeAdapter`](../wiki/PipeAdapter)

## Table of contents

### Properties

- [[read]](../wiki/PipeTarget#%5Bread%5D)

## Properties

### [read]

• **[read]**: (`value`: `T`, `source?`: `S`) => `void`

#### Type declaration

▸ (`value`, `source?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |
| `source?` | `S` |

##### Returns

`void`

#### Defined in

[src/protocol/pipeable.ts:15](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L15)
