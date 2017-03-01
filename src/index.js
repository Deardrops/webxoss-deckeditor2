import 'babel-polyfill'

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import App from './app'

import 'js/global'

import ImageFileCache from 'js/ImageFileCache'

// import { $get } from 'js/util'

sync(store, router)

// function addToCardInfo(CardInfo, suffix) {
//   if (!suffix) {
//     return
//   }

//   $get(`./lang/${suffix}.json`)
//     .then(newCardInfo => {
//       for (let pid in CardInfo) {
//         let info = CardInfo[pid]
//         let newInfo = newCardInfo[pid] || {}
//         for (let prop in info) {
//           let idx = prop.indexOf('_en')
//           if (idx === -1) {
//             continue
//           }
//           let newProp = prop.slice(0, idx) + suffix
//           info[newProp] = newInfo[newProp] || info[prop]
//         }
//       }
//     })
// }

// Deardrops: Add error meassage if load json fail
// $get('./CardInfo.json')
//   .then(CardInfo => {
//     // addToCardInfo(CardInfo, '_ko')
//     // addToCardInfo(CardInfo, '_ru')
//     window.CardInfo = Object.freeze(CardInfo)
//     ImageFileCache.init(() => {
//       new Vue({
//         el: '#app',
//         router,
//         store,
//         ...App,
//       })
//     }, 1000)
//   })

ImageFileCache.init(() => {
  new Vue({
    el: '#app',
    router,
    store,
    ...App,
  })
}, 1000)
