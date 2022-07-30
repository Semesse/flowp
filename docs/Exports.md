# flowp

## Table of contents

### Namespaces

- [to](../wiki/to)

### Classes

- [Channel](../wiki/Channel)
- [ChannelHub](../wiki/ChannelHub)
- [Future](../wiki/Future)
- [Mutex](../wiki/Mutex)
- [PipeAdapter](../wiki/PipeAdapter)
- [Semaphore](../wiki/Semaphore)

### Interfaces

- [Pipe](../wiki/Pipe)
- [PipeSource](../wiki/PipeSource)
- [PipeTarget](../wiki/PipeTarget)

### Type Aliases

- [Delegated](../wiki/Exports#delegated)

### Variables

- [read](../wiki/Exports#read)

### Functions

- [lateinit](../wiki/Exports#lateinit)
- [to](../wiki/Exports#to)

## Type Aliases

### Delegated

Ƭ **Delegated**<`T`\>: { readonly [K in keyof Awaited<T\> & string as \`$${K}\`]: Awaited<T\>[K] extends Callable ? Function : Delegated<Awaited<T\>[K]\> } & `Promise`<`Awaited`<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/promise/lateinit.ts:3](https://github.com/Semesse/flowp/blob/588de37/src/promise/lateinit.ts#L3)

## Variables

### read

• `Const` **read**: typeof [`read`](../wiki/Exports#read)

#### Defined in

[src/protocol/pipeable.ts:1](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L1)

## Functions

### lateinit

▸ **lateinit**<`T`\>(`value`): [`Delegated`](../wiki/Exports#delegated)<`T`\>

Delegates method calls and member access to the resolved value

**`Example`**

```ts
const promise = Promise.resolve({ foo: { bar: 'baz' } })
const delegated = lateinit(promise)
await delegated.$foo.$bar // 'baz'
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Promise`<`unknown`, `T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | value to delegate to, must be a promise and should not be resolve with primitives |

#### Returns

[`Delegated`](../wiki/Exports#delegated)<`T`\>

the delegated object, access delegated properties with `${key}`

#### Defined in

[src/promise/lateinit.ts:26](https://github.com/Semesse/flowp/blob/588de37/src/promise/lateinit.ts#L26)

___

### to

▸ **to**<`T`\>(`fn`): [`PipeTarget`](../wiki/PipeTarget)<`T`, [`PipeSource`](../wiki/PipeSource)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (`v`: `T`, `s?`: [`PipeSource`](../wiki/PipeSource)<`T`\>) => `any` |

#### Returns

[`PipeTarget`](../wiki/PipeTarget)<`T`, [`PipeSource`](../wiki/PipeSource)<`T`\>\>

#### Defined in

[src/protocol/pipeable.ts:45](https://github.com/Semesse/flowp/blob/588de37/src/protocol/pipeable.ts#L45)
