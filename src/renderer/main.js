import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import jiraClient from './jira'
import handleErrorsMixin from './mixins/handleErrors'
import locale from 'element-ui/lib/locale/lang/en'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import VueWait from 'vue-wait'
import PreloaderBar from '@/components/preloaderBar'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.jira = Vue.prototype.$jira = jiraClient

Vue.config.productionTip = false

Vue.use(ElementUI, { locale })
Vue.use(VueWait)
Vue.component('PreloaderBar', PreloaderBar)

Vue.use(PerfectScrollbar)

Vue.mixin(handleErrorsMixin)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  wait: new VueWait({
    useVuex: true
  })
}).$mount('#app')
