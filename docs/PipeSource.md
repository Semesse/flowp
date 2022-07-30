# Interface: PipeSource<T\>

a pipe source should be able to write its output to a pipe target

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **`PipeSource`**

  ↳ [`Pipe`](../wiki/Pipe)

## Implemented by

- [`Channel`](../wiki/Channel)
- [`PipeAdapter`](../wiki/PipeAdapter)

## Table of contents

### Properties

- [pipe](../wiki/PipeSource#pipe)
- [unpipe](../wiki/PipeSource#unpipe)

## Properties

### pipe

• **pipe**: (`target`: [`PipeTarget`](../wiki/PipeTarget)<`T`, [`PipeSource`](../wiki/PipeSource)<`T`\>\>) => `void`

#### Type declaration

▸ (`target`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`PipeTarget`](../wiki/PipeTarget)<`T`, [`PipeSource`](../wiki/PipeSource)<`T`\>\> |

##### Returns

`void`

#### Defined in

[src/protocol/pipeable.ts:7](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L7)

___

### unpipe

• **unpipe**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/protocol/pipeable.ts:8](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L8)
