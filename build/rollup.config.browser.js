import base from './rollup.config.base'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

const config = Object.assign({}, base, {
  exports: 'named',
  output: {
    file: 'dist/vue-live-preview.min.js',
    format: 'iife',
    libraryTarget: 'window',
    library: 'VueLivePreview',
  },
  name: 'VueLivePreview',
})

config.plugins.push(uglify({}, minify))

export default config