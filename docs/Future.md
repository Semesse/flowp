# Class: Future<T\>

Future is a resolve-later Promise, you can resolve it any time after a future is created.

**`example`**

```typescript
const future = new Future<number>()
// somewhere
const count = await future
// elsewhere, and the future becomes `fullfilled`
future.resolve(count)
```

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- `Promise`<`T`\>

  ↳ **`Future`**

## Table of contents

### Constructors

- [constructor](../wiki/Future#constructor-1)

### Properties

- [#reject](../wiki/Future##reject-1)
- [#resolve](../wiki/Future##resolve-1)
- [[toStringTag]](../wiki/Future#%5Btostringtag%5D-1)
- [#constructors](../wiki/Future##constructors-1)

### Accessors

- [[species]](../wiki/Future#%5Bspecies%5D-1)

### Methods

- [catch](../wiki/Future#catch-1)
- [finally](../wiki/Future#finally-1)
- [reject](../wiki/Future#reject-2)
- [resolve](../wiki/Future#resolve-2)
- [then](../wiki/Future#then-1)
- [all](../wiki/Future#all-1)
- [allSettled](../wiki/Future#allsettled-1)
- [any](../wiki/Future#any-1)
- [race](../wiki/Future#race-1)
- [reject](../wiki/Future#reject-3)
- [resolve](../wiki/Future#resolve-3)

## Constructors

### constructor

• **new Future**<`T`\>()

#### Type parameters

| Name |
| :------ |
| `T` |

#### Overrides

Promise&lt;T\&gt;.constructor

#### Defined in

[src/control/future.ts:23](https://github.com/Semesse/flowp/blob/d536b99/src/control/future.ts#L23)

## Properties

### #reject

• `Private` **#reject**: (`error`: `unknown`) => `void`

#### Type declaration

▸ (`error`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `unknown` |

##### Returns

`void`

#### Defined in

[src/control/future.ts:17](https://github.com/Semesse/flowp/blob/d536b99/src/control/future.ts#L17)

___

### #resolve

• `Private` **#resolve**: (`value`: `T` \| `PromiseLike`<`T`\>) => `void`

#### Type declaration

▸ (`value`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` \| `PromiseLike`<`T`\> |

##### Returns

`void`

#### Defined in

[src/control/future.ts:16](https://github.com/Semesse/flowp/blob/d536b99/src/control/future.ts#L16)

___

### [toStringTag]

• `Readonly` **[toStringTag]**: `string`

#### Inherited from

Promise.\_\_@toStringTag@336

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:174

___

### #constructors

▪ `Static` `Private` **#constructors**: [(`value`: `any`) => `void`, (`error`: `unknown`) => `void`][] = `[]`

#### Defined in

[src/control/future.ts:15](https://github.com/Semesse/flowp/blob/d536b99/src/control/future.ts#L15)

## Accessors

### [species]

• `Static` `get` **[species]**(): `PromiseConstructor`

#### Returns

`PromiseConstructor`

#### Overrides

Promise.\_\_@species@332

#### Defined in

[src/control/future.ts:19](https://github.com/Semesse/flowp/blob/d536b99/src/control/future.ts#L19)

## Methods

### catch

▸ **catch**<`TResult`\>(`onrejected?`): `Promise`<`T` \| `TResult`\>

Attaches a callback for only the rejection of the Promise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onrejected?` | ``null`` \| (`reason`: `any`) => `TResult` \| `PromiseLike`<`TResult`\> | The callback to execute when the Promise is rejected. |

#### Returns

`Promise`<`T` \| `TResult`\>

A Promise for the completion of the callback.

#### Inherited from

Promise.catch

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es5.d.ts:1515

___

### finally

▸ **finally**(`onfinally?`): `Promise`<`T`\>

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onfinally?` | ``null`` \| () => `void` | The callback to execute when the Promise is settled (fulfilled or rejected). |

#### Returns

`Promise`<`T`\>

A Promise for the completion of the callback.

#### Inherited from

Promise.finally

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2018.promise.d.ts:31

___

### reject

▸ **reject**(`error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `unknown` |

#### Returns

`void`

#### Defined in

[src/control/future.ts:37](https://github.com/Semesse/flowp/blob/d536b99/src/control/future.ts#L37)

___

### resolve

▸ **resolve**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` \| `PromiseLike`<`T`\> |

#### Returns

`void`

#### Defined in

[src/control/future.ts:33](https://github.com/Semesse/flowp/blob/d536b99/src/control/future.ts#L33)

___

### then

▸ **then**<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): `Promise`<`TResult1` \| `TResult2`\>

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult1` | `T` |
| `TResult2` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onfulfilled?` | ``null`` \| (`value`: `T`) => `TResult1` \| `PromiseLike`<`TResult1`\> | The callback to execute when the Promise is resolved. |
| `onrejected?` | ``null`` \| (`reason`: `any`) => `TResult2` \| `PromiseLike`<`TResult2`\> | The callback to execute when the Promise is rejected. |

#### Returns

`Promise`<`TResult1` \| `TResult2`\>

A Promise for the completion of which ever callback is executed.

#### Inherited from

Promise.then

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es5.d.ts:1508

___

### all

▸ `Static` **all**<`T`\>(`values`): `Promise`<`Awaited`<`T`\>[]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Iterable`<`T` \| `PromiseLike`<`T`\>\> | An iterable of Promises. |

#### Returns

`Promise`<`Awaited`<`T`\>[]\>

A new Promise.

#### Inherited from

Promise.all

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2015.iterable.d.ts:227

▸ `Static` **all**<`T`\>(`values`): `Promise`<{ -readonly [P in string \| number \| symbol]: Awaited<T[P]\> }\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [] \| readonly `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `T` | An array of Promises. |

#### Returns

`Promise`<{ -readonly [P in string \| number \| symbol]: Awaited<T[P]\> }\>

A new Promise.

#### Inherited from

Promise.all

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2015.promise.d.ts:41

___

### allSettled

▸ `Static` **allSettled**<`T`\>(`values`): `Promise`<{ -readonly [P in string \| number \| symbol]: PromiseSettledResult<Awaited<T[P]\>\> }\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [] \| readonly `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `T` | An array of Promises. |

#### Returns

`Promise`<{ -readonly [P in string \| number \| symbol]: PromiseSettledResult<Awaited<T[P]\>\> }\>

A new Promise.

#### Inherited from

Promise.allSettled

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2020.promise.d.ts:40

▸ `Static` **allSettled**<`T`\>(`values`): `Promise`<`PromiseSettledResult`<`Awaited`<`T`\>\>[]\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Iterable`<`T` \| `PromiseLike`<`T`\>\> | An array of Promises. |

#### Returns

`Promise`<`PromiseSettledResult`<`Awaited`<`T`\>\>[]\>

A new Promise.

#### Inherited from

Promise.allSettled

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2020.promise.d.ts:48

___

### any

▸ `Static` **any**<`T`\>(`values`): `Promise`<`Awaited`<`T`[`number`]\>\>

The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [] \| readonly `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `T` | An array or iterable of Promises. |

#### Returns

`Promise`<`Awaited`<`T`[`number`]\>\>

A new Promise.

#### Inherited from

Promise.any

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2021.promise.d.ts:42

▸ `Static` **any**<`T`\>(`values`): `Promise`<`Awaited`<`T`\>\>

The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Iterable`<`T` \| `PromiseLike`<`T`\>\> | An array or iterable of Promises. |

#### Returns

`Promise`<`Awaited`<`T`\>\>

A new Promise.

#### Inherited from

Promise.any

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2021.promise.d.ts:49

___

### race

▸ `Static` **race**<`T`\>(`values`): `Promise`<`Awaited`<`T`\>\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Iterable`<`T` \| `PromiseLike`<`T`\>\> | An iterable of Promises. |

#### Returns

`Promise`<`Awaited`<`T`\>\>

A new Promise.

#### Inherited from

Promise.race

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2015.iterable.d.ts:235

▸ `Static` **race**<`T`\>(`values`): `Promise`<`Awaited`<`T`[`number`]\>\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [] \| readonly `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `T` | An array of Promises. |

#### Returns

`Promise`<`Awaited`<`T`[`number`]\>\>

A new Promise.

#### Inherited from

Promise.race

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2015.promise.d.ts:52

___

### reject

▸ `Static` **reject**<`T`\>(`reason?`): `Promise`<`T`\>

Creates a new rejected promise for the provided reason.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reason?` | `any` | The reason the promise was rejected. |

#### Returns

`Promise`<`T`\>

A new rejected Promise.

#### Inherited from

Promise.reject

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2015.promise.d.ts:62

___

### resolve

▸ `Static` **resolve**(): `Promise`<`void`\>

Creates a new resolved promise.

#### Returns

`Promise`<`void`\>

A resolved promise.

#### Inherited from

Promise.resolve

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2015.promise.d.ts:68

▸ `Static` **resolve**<`T`\>(`value`): `Promise`<`T`\>

Creates a new resolved promise for the provided value.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` \| `PromiseLike`<`T`\> | A promise. |

#### Returns

`Promise`<`T`\>

A promise whose internal state matches the provided promise.

#### Inherited from

Promise.resolve

#### Defined in

node_modules/.pnpm/typescript@4.8.0-dev.20220510/node_modules/typescript/lib/lib.es2015.promise.d.ts:75
