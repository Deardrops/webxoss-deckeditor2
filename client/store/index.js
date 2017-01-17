import Vue from 'vue'
import Vuex from 'vuex'

import ImageManager from '../ImageManager.js'

Vue.use(Vuex)

const state = {
  count: 0,
  deck_filenames: [],
  deck_file: {},
  mainData: [],
  lrigData: [],
}

const mutations = {
  //TODO:增加或者删除卡片
  INCREMENT(state) {
    state.count++
  },
  DECREMENT(state) {
    state.count--
  },
}

const getters = {
  mainDeck: () => {
    return DeckWithCount('mainDeck')
  },
  lrigDeck: () => {
    return DeckWithCount('lrigDeck')
  },
}

const actions = {
  initDeck() {
    for (let pid of state.deck_file.mainDeck) {
      let Objs = state.mainData
      Objs.push({
        pid: pid,
        idx: Objs.length,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      })
    }
    for (let pid of state.deck_file.lrigDeck) {
      let Objs = state.lrigData
      Objs.push({
        pid: pid,
        idx: Objs.length,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      })
    }
  },
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
})

export default store

function DeckWithCount(deckName) {
  let Zdeck
  let Deck = []
  if (deckName === 'mainDeck') {
    Zdeck = state.mainData
  } else {
    Zdeck = state.lrigData
  }
  for (let card of Zdeck) {
    let flag = false
    for (let Zcard of Deck) {
      if (card.pid === Zcard.pid) {
        Zcard.count++
        flag = true
        break
      }
    }
    if (flag === false) {
      let Zcard = card
      Zcard.count = 1
      Deck.push(Zcard)
    }
  }
  return Deck
}
