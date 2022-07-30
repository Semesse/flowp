# Class: PipeAdapter<TIn, TOut\>

a pipe target can receive data from a pipe source

## Type parameters

| Name |
| :------ |
| `TIn` |
| `TOut` |

## Implements

- [`PipeTarget`](../wiki/PipeTarget)<`TIn`, [`PipeSource`](../wiki/PipeSource)<`TIn`\>\>
- [`PipeSource`](../wiki/PipeSource)<`TOut`\>

## Table of contents

### Constructors

- [constructor](../wiki/PipeAdapter#constructor)

### Properties

- [#target](../wiki/PipeAdapter##target)
- [handler](../wiki/PipeAdapter#handler)

### Methods

- [[read]](../wiki/PipeAdapter#%5Bread%5D)
- [pipe](../wiki/PipeAdapter#pipe)
- [unpipe](../wiki/PipeAdapter#unpipe)

## Constructors

### constructor

• **new PipeAdapter**<`TIn`, `TOut`\>(`handler`)

creates a pipe that transforms data from `TIn` to `TOut`

#### Type parameters

| Name |
| :------ |
| `TIn` |
| `TOut` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | (`value`: `TIn`) => `TOut` | transform data in pipe |

#### Defined in

[src/protocol/pipeable.ts:28](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L28)

## Properties

### #target

• `Private` **#target**: ``null`` \| [`PipeTarget`](../wiki/PipeTarget)<`TOut`, [`PipeSource`](../wiki/PipeSource)<`TOut`\>\> = `null`

#### Defined in

[src/protocol/pipeable.ts:22](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L22)

___

### handler

• **handler**: (`value`: `TIn`, `source?`: [`PipeSource`](../wiki/PipeSource)<`TIn`\>) => `TOut`

#### Type declaration

▸ (`value`, `source?`): `TOut`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TIn` |
| `source?` | [`PipeSource`](../wiki/PipeSource)<`TIn`\> |

##### Returns

`TOut`

#### Defined in

[src/protocol/pipeable.ts:21](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L21)

## Methods

### [read]

▸ **[read]**(`value`, `source?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TIn` |
| `source?` | [`PipeSource`](../wiki/PipeSource)<`TIn`\> |

#### Returns

`void`

#### Implementation of

PipeTarget.\_\_@read@785

#### Defined in

[src/protocol/pipeable.ts:40](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L40)

___

### pipe

▸ **pipe**(`target`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`PipeTarget`](../wiki/PipeTarget)<`TOut`, [`PipeSource`](../wiki/PipeSource)<`TOut`\>\> |

#### Returns

`void`

#### Implementation of

PipeSource.pipe

#### Defined in

[src/protocol/pipeable.ts:32](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L32)

___

### unpipe

▸ **unpipe**(): `void`

#### Returns

`void`

#### Implementation of

PipeSource.unpipe

#### Defined in

[src/protocol/pipeable.ts:36](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L36)
