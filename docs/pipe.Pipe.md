# Interface: Pipe<TIn, TOut\>

[pipe](../wiki/pipe).Pipe

a pipe target can receive data from a pipe source

## Type parameters

| Name |
| :------ |
| `TIn` |
| `TOut` |

## Hierarchy

- [`PipeTarget`](../wiki/pipe.PipeTarget)<`TIn`\>

- [`PipeSource`](../wiki/pipe.PipeSource)<`TOut`\>

  ↳ **`Pipe`**

## Table of contents

### Properties

- [[read]](../wiki/pipe.Pipe#%5Bread%5D)
- [pipe](../wiki/pipe.Pipe#pipe)
- [unpipe](../wiki/pipe.Pipe#unpipe)

## Properties

### [read]

• **[read]**: (`value`: `TIn`, `source?`: [`PipeSource`](../wiki/pipe.PipeSource)<`TIn`\>) => `void`

#### Type declaration

▸ (`value`, `source?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TIn` |
| `source?` | [`PipeSource`](../wiki/pipe.PipeSource)<`TIn`\> |

##### Returns

`void`

#### Inherited from

[PipeTarget](../wiki/pipe.PipeTarget).[[read]](../wiki/pipe.PipeTarget#%5Bread%5D)

#### Defined in

[src/control/pipeable.ts:15](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L15)

___

### pipe

• **pipe**: (`target`: [`PipeTarget`](../wiki/pipe.PipeTarget)<`TOut`, [`PipeSource`](../wiki/pipe.PipeSource)<`TOut`\>\>) => `void`

#### Type declaration

▸ (`target`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`PipeTarget`](../wiki/pipe.PipeTarget)<`TOut`, [`PipeSource`](../wiki/pipe.PipeSource)<`TOut`\>\> |

##### Returns

`void`

#### Inherited from

[PipeSource](../wiki/pipe.PipeSource).[pipe](../wiki/pipe.PipeSource#pipe)

#### Defined in

[src/control/pipeable.ts:7](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L7)

___

### unpipe

• **unpipe**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

[PipeSource](../wiki/pipe.PipeSource).[unpipe](../wiki/pipe.PipeSource#unpipe)

#### Defined in

[src/control/pipeable.ts:8](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L8)
