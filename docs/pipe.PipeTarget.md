# Interface: PipeTarget<T, S\>

[pipe](../wiki/pipe).PipeTarget

a pipe target can receive data from a pipe source

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | [`PipeSource`](../wiki/pipe.PipeSource)<`T`\> |

## Hierarchy

- **`PipeTarget`**

  ↳ [`Pipe`](../wiki/pipe.Pipe)

## Implemented by

- [`Channel`](../wiki/Channel)
- [`ChannelHub`](../wiki/ChannelHub)
- [`PipeAdapter`](../wiki/pipe.PipeAdapter)
- [`PipeToConsole`](../wiki/pipe.PipeToConsole)

## Table of contents

### Properties

- [[read]](../wiki/pipe.PipeTarget#%5Bread%5D)

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

[src/control/pipeable.ts:15](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L15)
