import base from './rollup.config.base'

const config = Object.assign({}, base, {
  exports: 'named',
  output: {
    file: 'dist/vue-live-preview.umd.js',
    format: 'umd',
  },
})

export default config