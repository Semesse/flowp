# Class: Semaphore

Semaphore

**`Param`**

number of permits

**`Example`**

```ts
const sem = new Semaphore(5)
const release = await sem.acquire()
// do something
release()
```

## Table of contents

### Constructors

- [constructor](../wiki/Semaphore#constructor)

### Properties

- [#permits](../wiki/Semaphore##permits)
- [#queue](../wiki/Semaphore##queue)

### Accessors

- [isEmpty](../wiki/Semaphore#isempty)
- [isFull](../wiki/Semaphore#isfull)
- [permits](../wiki/Semaphore#permits)
- [remain](../wiki/Semaphore#remain)

### Methods

- [#release](../wiki/Semaphore##release)
- [#remove](../wiki/Semaphore##remove)
- [#resolveNext](../wiki/Semaphore##resolvenext)
- [acquire](../wiki/Semaphore#acquire)
- [grant](../wiki/Semaphore#grant)
- [revoke](../wiki/Semaphore#revoke)
- [tryAcquire](../wiki/Semaphore#tryacquire)

## Constructors

### constructor

• **new Semaphore**(`permits?`)

constructs a new Semaphore with n permits

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `permits?` | `number` | number of permits |

#### Defined in

[src/control/semaphore.ts:23](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L23)

## Properties

### #permits

• `Private` **#permits**: `number`

#### Defined in

[src/control/semaphore.ts:15](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L15)

___

### #queue

• `Private` **#queue**: [`Future`](../wiki/Future)<`void`\>[] = `[]`

#### Defined in

[src/control/semaphore.ts:17](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L17)

## Accessors

### isEmpty

• `get` **isEmpty**(): `boolean`

Check if no task is using the semaphore

#### Returns

`boolean`

#### Defined in

[src/control/semaphore.ts:122](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L122)

___

### isFull

• `get` **isFull**(): `boolean`

Check if all permits are being used

#### Returns

`boolean`

#### Defined in

[src/control/semaphore.ts:115](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L115)

___

### permits

• `get` **permits**(): `number`

Get the number of total permits currently

#### Returns

`number`

#### Defined in

[src/control/semaphore.ts:108](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L108)

___

### remain

• `get` **remain**(): `number`

Get the number of remaining permits

#### Returns

`number`

#### Defined in

[src/control/semaphore.ts:101](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L101)

## Methods

### #release

▸ `Private` **#release**(`token`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Future`](../wiki/Future)<`void`\> |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/control/semaphore.ts:126](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L126)

___

### #remove

▸ `Private` **#remove**(`token`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Future`](../wiki/Future)<`void`\> |

#### Returns

`void`

#### Defined in

[src/control/semaphore.ts:141](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L141)

___

### #resolveNext

▸ `Private` **#resolveNext**(`count?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `count` | `number` | `1` |

#### Returns

`void`

#### Defined in

[src/control/semaphore.ts:135](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L135)

___

### acquire

▸ **acquire**(`timeout?`): `Promise`<() => `void`\>

Acquire a permit, will not resolve if the semaphore is full

#### Parameters

| Name | Type |
| :------ | :------ |
| `timeout?` | `number` |

#### Returns

`Promise`<() => `void`\>

a function to release semaphore

#### Defined in

[src/control/semaphore.ts:31](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L31)

___

### grant

▸ **grant**(`permits?`): `void`

Give n permits to semaphore, will immediately start this number of waiting tasks if any

**`Throws`**

RangeError if permits < 0

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `permits` | `number` | `1` |

#### Returns

`void`

#### Defined in

[src/control/semaphore.ts:70](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L70)

___

### revoke

▸ **revoke**(`permits?`): `Promise`<`void`\>

Destroy n permits, effective until `remain` fills the n permits

**note**: you may need to check if `permits > semaphore.permits`, or it will wait until granted that many permits

**`Throws`**

RangeError if permits < 0

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `permits` | `number` | `1` | number of permits |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/control/semaphore.ts:83](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L83)

___

### tryAcquire

▸ **tryAcquire**(): () => `void`

Try to synchronosly acquire if the semaphore is not full

**`Throws`**

Error if semaphore is full

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/control/semaphore.ts:56](https://github.com/Semesse/flowp/blob/242138c/src/control/semaphore.ts#L56)
