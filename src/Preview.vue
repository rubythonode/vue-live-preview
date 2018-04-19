<template>
  <div class="row live-preview">
    <div v-if="show" v-bind:class="classCode">
      <codemirror v-model="model" @input="change"></codemirror>
      <hr>
    </div>
    <div v-bind:class="[classPrev, scope]">
      <div id="component"></div>
    </div>
  </div>
</template>

<script>

  import { _Vue as Vue } from './index'
  import Babel from 'babel-standalone'

  export default {
    name: 'live-preview',
    data() {
      return {
        model: null,
        show: this.showCode,
        scope: this.generateScope(),
      }
    },
    props: {
      code: {
        type: String,
        default: null,
        required: true,
      },
      scoped: {
        type: Boolean,
        default: true
      },
      showCode: {
        type: Boolean,
        default: true
      },
      classCode: {
        type: String,
        default: 'col-md-12'
      },
      classPrev: {
        type: String,
        default: 'col-md-12'
      }
    },
    methods: {
      init (code) {
        code = code.trim()
        this.model = code;
        this.change(code)
      },
      generateScope () {
        return  'v-xxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },
      scopeStyle (style) {
        return style.trim().replace(/(^|\})\s*([^{]+)/g, (m, g1, g2) => {
          return g1 ? `${g1} .${this.scope} ${g2}` : `.${this.scope} ${g2}`
        })
      },
      change (code) {

        console.log(code)

        const html = document.createElement('div')
        html.innerHTML = code

        let template, script, style, monofile = true

        template = html.querySelector('template')

        if (!template) {
          monofile = false
        }

        script = html.querySelector('script')
        style = html.querySelectorAll('style')

        if (!monofile) {
          if (script) {
            html.querySelector('script').remove()
          }
          Array.prototype.slice.call(html.querySelectorAll('style')).forEach(n => n.remove())
          template = html
        }

        template = template ? template.innerHTML : ''
        style = Array.prototype.slice.call(style).map(n => n.innerHTML)

        if (script) {
          script = script.innerHTML
        }

        style = style.join(' ')

        let data = {}

        if (monofile && typeof script === 'string') {
          try {
            const exports = {}
            let js = Babel.transform(script, { presets: ['es2015'] }).code
            data = eval(js)
          } catch(e) {}
        }

        if (template !== this.template || script !== this.script) {

          this.template = template
          this.script = script

          new Vue({
            el: '#component',
            template: `<div id="component"><div id="content"></div></div>`,
          })

          if (monofile) {
            new Vue(Object.assign({
              el: '#content',
              template: template,
            }, data))
          } else {
            document.getElementById('content').innerHTML = template
            try {
              eval(script)
            } catch(e) {}
          }
        }

        if (!this.elStyle) {
          const head = document.head || document.getElementsByTagName('head')[0]
          this.elStyle = document.createElement('style')
          this.elStyle.type = 'text/css'
          head.appendChild(this.elStyle)
        }
        
        this.elStyle.innerHTML = this.scoped ? this.scopeStyle(style) : style
      },
    },
    mounted() {
      this.init(this.code);

      Vue.config.errorHandler = (error) => console.warn(error)
      Vue.config.warnHandler = (error) => console.warn(error)
    },
    watch: {
      showCode (value) {
        this.show = value;
      }
    },
  }
</script>