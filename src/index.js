import VueLivePreview from './Preview.vue'
import VueCodemirror from 'vue-codemirror'

export let _Vue

const defaultOptions = {
  theme: 'default',
  tabSize: 2,
  lineNumbers: true,
  mode: 'text/x-vue',
}

function install(Vue, options = {}) {
  if (install.installed && _Vue === Vue) return
  _Vue = Vue
  install.installed = true
  options = Object.assign(defaultOptions, options)
  Vue.use(VueCodemirror, {
    options: options
  })
  Vue.component(VueLivePreview.name, VueLivePreview)
}

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(install)
}

export { VueLivePreview, VueCodemirror }
export default install