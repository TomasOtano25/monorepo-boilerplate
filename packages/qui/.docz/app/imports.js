export const imports = {
  'src/Button.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-button" */ 'src/Button.mdx'),
}
