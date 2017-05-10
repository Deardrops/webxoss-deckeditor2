import 'babel-polyfill'

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import App from './app'

import 'js/global'

import ImageFileCache from 'js/ImageFileCache'

import { $get } from 'js/util'

sync(store, router)

ImageFileCache.init()
.catch(error => {
  console.error('Error in ImageFileCache.init():')
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

window.CardInfo_jp = Object.create(window.CardInfo)
window.CardInfo_zh = Object.create(window.CardInfo)
window.CardInfo_en = Object.create(window.CardInfo)
window.CardInfo_ko = Object.create(window.CardInfo)
window.CardInfo_ru = Object.create(window.CardInfo)
window.CardInfo_it = Object.create(window.CardInfo)

let CardInfos = {
  'CardInfo_zh_CN': window.CardInfo_zh,
  'CardInfo_en': window.CardInfo_en,
  'CardInfo_ko': window.CardInfo_ko,
  'CardInfo_ru': window.CardInfo_ru,
}

let dir = location.pathname.match(/\/next\/?$/) ? '../lang/' : './lang/'
for (let name of Object.keys(CardInfos)) {
  $get(dir + name + '.json')
    .then(translation => {
      for (let pid in translation) {
        let tran = translation[pid]
        let info = Object.create(CardInfo[pid])
        for (let prop in tran) {
          info[prop] = tran[prop]
        }
        info.pid = +info.pid
        CardInfos[name][pid] = info
        if (name === 'CardInfo_en') {
          window.CardInfo_it = CardInfos[name]
        }
      }
    })
}
