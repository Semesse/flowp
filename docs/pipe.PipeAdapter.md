# Class: PipeAdapter<TIn, TOut\>

[pipe](../wiki/pipe).PipeAdapter

a pipe target can receive data from a pipe source

## Type parameters

| Name |
| :------ |
| `TIn` |
| `TOut` |

## Implements

- [`PipeTarget`](../wiki/pipe.PipeTarget)<`TIn`, [`PipeSource`](../wiki/pipe.PipeSource)<`TIn`\>\>
- [`PipeSource`](../wiki/pipe.PipeSource)<`TOut`\>

## Table of contents

### Constructors

- [constructor](../wiki/pipe.PipeAdapter#constructor)

### Properties

- [#target](../wiki/pipe.PipeAdapter##target)
- [handler](../wiki/pipe.PipeAdapter#handler)

### Methods

- [[read]](../wiki/pipe.PipeAdapter#%5Bread%5D)
- [pipe](../wiki/pipe.PipeAdapter#pipe)
- [unpipe](../wiki/pipe.PipeAdapter#unpipe)

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

[src/control/pipeable.ts:28](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L28)

## Properties

### #target

• `Private` **#target**: ``null`` \| [`PipeTarget`](../wiki/pipe.PipeTarget)<`TOut`, [`PipeSource`](../wiki/pipe.PipeSource)<`TOut`\>\> = `null`

#### Defined in

[src/control/pipeable.ts:22](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L22)

___

### handler

• **handler**: (`value`: `TIn`, `source?`: [`PipeSource`](../wiki/pipe.PipeSource)<`TIn`\>) => `TOut`

#### Type declaration

▸ (`value`, `source?`): `TOut`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TIn` |
| `source?` | [`PipeSource`](../wiki/pipe.PipeSource)<`TIn`\> |

##### Returns

`TOut`

#### Defined in

[src/control/pipeable.ts:21](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L21)

## Methods

### [read]

▸ **[read]**(`value`, `source?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TIn` |
| `source?` | [`PipeSource`](../wiki/pipe.PipeSource)<`TIn`\> |

#### Returns

`void`

#### Implementation of

PipeTarget.\_\_@read@177

#### Defined in

[src/control/pipeable.ts:40](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L40)

___

### pipe

▸ **pipe**(`target`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`PipeTarget`](../wiki/pipe.PipeTarget)<`TOut`, [`PipeSource`](../wiki/pipe.PipeSource)<`TOut`\>\> |

#### Returns

`void`

#### Implementation of

PipeSource.pipe

#### Defined in

[src/control/pipeable.ts:32](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L32)

___

### unpipe

▸ **unpipe**(): `void`

#### Returns

`void`

#### Implementation of

PipeSource.unpipe

#### Defined in

[src/control/pipeable.ts:36](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L36)
