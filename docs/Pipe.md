# Interface: Pipe<TIn, TOut\>

a pipe target can receive data from a pipe source

## Type parameters

| Name |
| :------ |
| `TIn` |
| `TOut` |

## Hierarchy

- [`PipeTarget`](../wiki/PipeTarget)<`TIn`\>

- [`PipeSource`](../wiki/PipeSource)<`TOut`\>

  ↳ **`Pipe`**

## Table of contents

### Properties

- [[read]](../wiki/Pipe#%5Bread%5D)
- [pipe](../wiki/Pipe#pipe)
- [unpipe](../wiki/Pipe#unpipe)

## Properties

### [read]

• **[read]**: (`value`: `TIn`, `source?`: [`PipeSource`](../wiki/PipeSource)<`TIn`\>) => `void`

#### Type declaration

▸ (`value`, `source?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TIn` |
| `source?` | [`PipeSource`](../wiki/PipeSource)<`TIn`\> |

##### Returns

`void`

#### Inherited from

[PipeTarget](../wiki/PipeTarget).[[read]](../wiki/PipeTarget#%5Bread%5D)

#### Defined in

[src/protocol/pipeable.ts:15](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L15)

___

### pipe

• **pipe**: (`target`: [`PipeTarget`](../wiki/PipeTarget)<`TOut`, [`PipeSource`](../wiki/PipeSource)<`TOut`\>\>) => `void`

#### Type declaration

▸ (`target`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`PipeTarget`](../wiki/PipeTarget)<`TOut`, [`PipeSource`](../wiki/PipeSource)<`TOut`\>\> |

##### Returns

`void`

#### Inherited from

[PipeSource](../wiki/PipeSource).[pipe](../wiki/PipeSource#pipe)

#### Defined in

[src/protocol/pipeable.ts:7](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L7)

___

### unpipe

• **unpipe**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

[PipeSource](../wiki/PipeSource).[unpipe](../wiki/PipeSource#unpipe)

#### Defined in

[src/protocol/pipeable.ts:8](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L8)
