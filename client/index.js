import { app } from './app'

// TODO: fetch polyfill
fetch('./CardInfo.json')
  .then(res => res.json())
  .then(CardInfo => {
    window.CardInfo = CardInfo
    app.$mount('#app')
  })
