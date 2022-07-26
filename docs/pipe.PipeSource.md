# Interface: PipeSource<T\>

[pipe](../wiki/pipe).PipeSource

a pipe source should be able to write its output to a pipe target

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **`PipeSource`**

  ↳ [`Pipe`](../wiki/pipe.Pipe)

## Implemented by

- [`Channel`](../wiki/Channel)
- [`PipeAdapter`](../wiki/pipe.PipeAdapter)

## Table of contents

### Properties

- [pipe](../wiki/pipe.PipeSource#pipe)
- [unpipe](../wiki/pipe.PipeSource#unpipe)

## Properties

### pipe

• **pipe**: (`target`: [`PipeTarget`](../wiki/pipe.PipeTarget)<`T`, [`PipeSource`](../wiki/pipe.PipeSource)<`T`\>\>) => `void`

#### Type declaration

▸ (`target`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`PipeTarget`](../wiki/pipe.PipeTarget)<`T`, [`PipeSource`](../wiki/pipe.PipeSource)<`T`\>\> |

##### Returns

`void`

#### Defined in

[src/control/pipeable.ts:7](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L7)

___

### unpipe

• **unpipe**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/control/pipeable.ts:8](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L8)
