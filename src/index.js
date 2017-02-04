import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import App from './app'

import 'js/global'

import Localize from 'js/Localize'
Localize.setLanguage('en') // test

import { $get } from 'js/util'

sync(store, router)

// Deardrops: Add error meassage if load json fail
$get('./CardInfo.json')
  .then(CardInfo => {
    window.CardInfo = Object.freeze(CardInfo)
    new Vue({
      el: '#app',
      router,
      store,
      ...App,
    })
  })
