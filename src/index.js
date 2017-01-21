import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import App from './app'

sync(store, router)

// TODO: fetch polyfill
// Deardrops: Add error meassage if load json fail
fetch('./CardInfo.json')
  .then(res => res.json())
  .then(CardInfo => {
    window.CardInfo = Object.freeze(CardInfo)
    new Vue({
      el: '#app',
      router,
      store,
      ...App,
    })
  })
