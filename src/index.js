import { app } from './app'

// TODO: fetch polyfill
// Deardrops:Add error meassage if load json fail
fetch('./CardInfo.json')
  .then(res => res.json())
  .then(CardInfo => {
    window.CardInfo = Object.freeze(CardInfo)
    app.$mount('#app')
  })
