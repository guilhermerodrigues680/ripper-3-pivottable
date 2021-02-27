import Vue from 'vue'
import App from './App.vue'
import VuePivottable from 'vue-pivottable'
import VuePapaParse from 'vue-papa-parse'

import 'vue-pivottable/dist/vue-pivottable.css'

Vue.use(VuePivottable)
Vue.use(VuePapaParse)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
