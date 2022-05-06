# Class: Semaphore

Semaphore

**`param`** number of permits

**`example`**
const sem = new Semaphore(5)
const release = await sem.acquire()
// do something
release()

## Table of contents

### Constructors

- [constructor](../wiki/Semaphore#constructor-1)

### Properties

- [#permits](../wiki/Semaphore##permits-1)
- [#queue](../wiki/Semaphore##queue-1)

### Accessors

- [isEmpty](../wiki/Semaphore#isempty-1)
- [isFull](../wiki/Semaphore#isfull-1)
- [permits](../wiki/Semaphore#permits-1)
- [remain](../wiki/Semaphore#remain-1)

### Methods

- [#release](../wiki/Semaphore##release-1)
- [#remove](../wiki/Semaphore##remove-1)
- [#resolveNext](../wiki/Semaphore##resolvenext-1)
- [acquire](../wiki/Semaphore#acquire-1)
- [grant](../wiki/Semaphore#grant-1)
- [revoke](../wiki/Semaphore#revoke-1)
- [tryAcquire](../wiki/Semaphore#tryacquire-1)

## Constructors

### constructor

• **new Semaphore**(`permits?`)

constructs a new Semaphore with n permits

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `permits?` | `number` | number of permits |

#### Defined in

[src/control/semaphore.ts:23](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L23)

## Properties

### #permits

• `Private` **#permits**: `number`

#### Defined in

[src/control/semaphore.ts:15](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L15)

___

### #queue

• `Private` **#queue**: [`Future`](../wiki/Future)<`void`\>[] = `[]`

#### Defined in

[src/control/semaphore.ts:17](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L17)

## Accessors

### isEmpty

• `get` **isEmpty**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/control/semaphore.ts:108](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L108)

___

### isFull

• `get` **isFull**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/control/semaphore.ts:104](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L104)

___

### permits

• `get` **permits**(): `number`

#### Returns

`number`

#### Defined in

[src/control/semaphore.ts:100](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L100)

___

### remain

• `get` **remain**(): `number`

#### Returns

`number`

#### Defined in

[src/control/semaphore.ts:96](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L96)

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

[src/control/semaphore.ts:112](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L112)

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

[src/control/semaphore.ts:127](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L127)

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

[src/control/semaphore.ts:121](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L121)

___

### acquire

▸ **acquire**(`timeout?`): `Promise`<() => `void`\>

acquire a permit, will not resolve if the semaphore is full

#### Parameters

| Name | Type |
| :------ | :------ |
| `timeout?` | `number` |

#### Returns

`Promise`<() => `void`\>

a function to release semaphore

#### Defined in

[src/control/semaphore.ts:31](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L31)

___

### grant

▸ **grant**(`permits?`): `void`

add n permits to semaphore, will immediately start this number of waiting tasks

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `permits` | `number` | `1` |

#### Returns

`void`

#### Defined in

[src/control/semaphore.ts:69](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L69)

___

### revoke

▸ **revoke**(`permits?`): `Promise`<`void`\>

reduce the number of permits by n, effective until `remain` fills the n permits

**note**: you may need to check if `permits > semaphore.permits`, or it will wait until granted that many permits

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `permits` | `number` | `1` | number of permits |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/control/semaphore.ts:81](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L81)

___

### tryAcquire

▸ **tryAcquire**(): () => `void`

try to synchronosly acquire if the semaphore is not full

**`throws`** Error if semaphore is full

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/control/semaphore.ts:56](https://github.com/Semesse/flowp/blob/5067796/src/control/semaphore.ts#L56)
