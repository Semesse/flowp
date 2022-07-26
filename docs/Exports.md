# flowp

## Table of contents

### Namespaces

- [pipe](../wiki/pipe)

### Classes

- [Channel](../wiki/Channel)
- [ChannelHub](../wiki/ChannelHub)
- [Future](../wiki/Future)
- [Mutex](../wiki/Mutex)
- [Semaphore](../wiki/Semaphore)

### Functions

- [lateinit](../wiki/Exports#lateinit)

## Functions

### lateinit

▸ **lateinit**<`T`\>(`value`): `Delegated`<`T`\>

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

`Delegated`<`T`\>

the delegated object, access delegated properties with `${key}`

#### Defined in

[src/control/lateinit.ts:26](https://github.com/Semesse/flowp/blob/165e59c/src/control/lateinit.ts#L26)
