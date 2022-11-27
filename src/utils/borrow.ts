/**
 * create a reference to target
 * return the reference and a revoke function that will invalidate the reference
 *
 * further call will throw an type error
 *
 * TODO: currently no support for class private field - do we need a transparent proxy in this library?
 */
export const borrow = <T extends object>(value: T): [T, () => void] => {
  const borrowRef = Proxy.revocable<T>(value, {})

  return [borrowRef.proxy, borrowRef.revoke]
}
