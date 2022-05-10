export type Equal<X, Y> = (<G>() => G extends X ? 1 : 2) extends <G>() => G extends Y ? 1 : 2 ? true : false
export type Not<Cond extends boolean> = Cond extends true ? false : true
export type NotEqual<X, Y> = Not<Equal<X, Y>>

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Assert<Cond extends boolean> = Cond extends true ? void : never
export type AssertEqual<X, Y> = Assert<Equal<X, Y>>
export type AssertNotEqual<X, Y> = Assert<NotEqual<X, Y>>

export type F<TArgs extends any[] | [], TReturn> = (...args: TArgs) => TReturn
export type Callable = F<any[], any>
