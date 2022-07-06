# Class: PipeAdapter<TIn, TOut\>

## Type parameters

| Name |
| :------ |
| `TIn` |
| `TOut` |

## Implements

- `PipeSource`<`TOut`\>
- `PipeTarget`<`TIn`\>

## Table of contents

### Constructors

- [constructor](../wiki/PipeAdapter#constructor-1)

### Properties

- [#target](../wiki/PipeAdapter##target-1)
- [handler](../wiki/PipeAdapter#handler-1)

### Methods

- [[read]](../wiki/PipeAdapter#%5Bread%5D-1)
- [pipe](../wiki/PipeAdapter#pipe-1)
- [unpipe](../wiki/PipeAdapter#unpipe-1)

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

[src/control/pipeable.ts:26](https://github.com/Semesse/flowp/blob/2fd91f2/src/control/pipeable.ts#L26)

## Properties

### #target

• `Private` **#target**: ``null`` \| `PipeTarget`<`TOut`\> = `null`

#### Defined in

[src/control/pipeable.ts:20](https://github.com/Semesse/flowp/blob/2fd91f2/src/control/pipeable.ts#L20)

___

### handler

• **handler**: (`value`: `TIn`) => `TOut`

#### Type declaration

▸ (`value`): `TOut`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TIn` |

##### Returns

`TOut`

#### Defined in

[src/control/pipeable.ts:19](https://github.com/Semesse/flowp/blob/2fd91f2/src/control/pipeable.ts#L19)

## Methods

### [read]

▸ **[read]**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TIn` |

#### Returns

`void`

#### Implementation of

PipeTarget.\_\_@read@149

#### Defined in

[src/control/pipeable.ts:38](https://github.com/Semesse/flowp/blob/2fd91f2/src/control/pipeable.ts#L38)

___

### pipe

▸ **pipe**(`target`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `PipeTarget`<`TOut`\> |

#### Returns

`void`

#### Implementation of

PipeSource.pipe

#### Defined in

[src/control/pipeable.ts:30](https://github.com/Semesse/flowp/blob/2fd91f2/src/control/pipeable.ts#L30)

___

### unpipe

▸ **unpipe**(): `void`

#### Returns

`void`

#### Implementation of

PipeSource.unpipe

#### Defined in

[src/control/pipeable.ts:34](https://github.com/Semesse/flowp/blob/2fd91f2/src/control/pipeable.ts#L34)
