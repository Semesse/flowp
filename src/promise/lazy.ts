export const lazy = <T>(evaluate: () => T) => {
  return new Proxy(
    {},
    {
      get,
    }
  )
}
