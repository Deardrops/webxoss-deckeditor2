import Vue from 'vue'
import {sync} from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

sync(store, router)

Vue.use(MintUI)

const app = new Vue({
  router,
  store,
  ...App
})

export {app, router, store}
