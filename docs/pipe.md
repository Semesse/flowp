# Namespace: pipe

## Table of contents

### Classes

- [PipeAdapter](../wiki/pipe.PipeAdapter)
- [PipeToConsole](../wiki/pipe.PipeToConsole)

### Interfaces

- [Pipe](../wiki/pipe.Pipe)
- [PipeSource](../wiki/pipe.PipeSource)
- [PipeTarget](../wiki/pipe.PipeTarget)

### Variables

- [read](../wiki/pipe#read)

### Functions

- [to](../wiki/pipe#to)

## Variables

### read

• `Const` **read**: typeof [`read`](../wiki/pipe#read)

#### Defined in

[src/control/pipeable.ts:1](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L1)

## Functions

### to

▸ **to**<`T`\>(`fn`): [`PipeTarget`](../wiki/pipe.PipeTarget)<`T`, [`PipeSource`](../wiki/pipe.PipeSource)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (`v`: `T`, `s?`: [`PipeSource`](../wiki/pipe.PipeSource)<`T`\>) => `any` |

#### Returns

[`PipeTarget`](../wiki/pipe.PipeTarget)<`T`, [`PipeSource`](../wiki/pipe.PipeSource)<`T`\>\>

#### Defined in

[src/control/pipeable.ts:45](https://github.com/Semesse/flowp/blob/165e59c/src/control/pipeable.ts#L45)
