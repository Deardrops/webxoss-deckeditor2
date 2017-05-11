import 'babel-polyfill'

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import App from './app'

import 'js/global'

import ImageFileCache from 'js/ImageFileCache'
import { initCardInfos } from 'js/CardInfoManager'

initCardInfos()

sync(store, router)

ImageFileCache.init()
.catch(error => {
  window.alert('Error in ImageFileCache.init()')
  console.error(error)
})
.then(() => {
  new Vue({
    el: '#app',
    router,
    store,
    ...App,
  })
})

