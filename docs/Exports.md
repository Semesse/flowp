# flowp

## Table of contents

### Classes

- [Channel](../wiki/Channel)
- [Future](../wiki/Future)
- [Mutex](../wiki/Mutex)
- [PipeAdapter](../wiki/PipeAdapter)
- [Semaphore](../wiki/Semaphore)

### Functions

- [lateinit](../wiki/Exports#lateinit-1)

## Functions

### lateinit

▸ **lateinit**<`T`\>(`value`): `Delegated`<`T`\>

Delegates method calls and member access to the resolved value

**`example`**
const promise = Promise.resolve({ foo: { bar: 'baz' } })
const delegated = lateinit(promise)
await delegated.$foo.$bar // 'baz'

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

[src/control/lateinit.ts:25](https://github.com/Semesse/flowp/blob/d536b99/src/control/lateinit.ts#L25)
