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
  addCard(state, card){
    let pid = card.pid
    let Data
    if (card.deckName === 'mainDeck') {
      Data = state.mainData
    } else {
      Data = state.lrigData
    }
    Data.push({
      pid: pid,
      info: CardInfo[pid],
      img: ImageManager.getUrlByPid(pid),
    })
    defaultSort(state.mainData)
    defaultSort(state.lrigData)
  },
  delCard(state, card){
    //TODO:验证输入
    let idx
    if (card.deckName === 'mainDeck') {
      idx = state.mainData.findIndex(data => data.pid === card.pid)
      state.mainData.splice(idx, 1)
    } else {
      idx = state.lrigData.findIndex(data => data.pid === card.pid)
      state.lrigData.splice(idx, 1)
    }
  },
  fillDeckFile(state, payload){
    state.deck_file = payload
  },
  initDeck(state) {
    for (let pid of state.deck_file.mainDeck) {
      let Data = state.mainData
      Data.push({
        pid: pid,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      })
    }
    for (let pid of state.deck_file.lrigDeck) {
      let Data = state.lrigData
      Data.push({
        pid: pid,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      })
    }
  },
}

const getters = {
  mainDeck: state => {
    return DeckWithCount('mainDeck', state)
  },
  lrigDeck: state => {
    return DeckWithCount('lrigDeck', state)
  },
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
})

export default store

function DeckWithCount(deckName, state) {
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

function defaultSort(data){
  data.sort(function (aObj, bObj) {
    const a = aObj.info
    const b = bObj.info
    const aIdx = aObj.idx
    const bIdx = bObj.idx
    if (a.cardType === 'LRIG') {
      if (b.cardType !== 'LRIG') return -1
      if (b.level !== a.level) {
        return a.level - b.level
      }
    }
    if (a.cardType === 'ARTS') {
      if (b.cardType !== 'ARTS') return 1
    }
    if (a.cardType === 'RESONA') {
      if (b.cardType === 'LRIG') return 1
      if (b.cardType === 'ARTS') return -1
      if (b.level !== a.level) {
        return a.level - b.level
      }
    }
    if (a.cardType === 'SIGNI') {
      if (b.cardType !== 'SIGNI') return -1
      if (a.level !== b.level) {
        return b.level - a.level
      }
      if (a.power !== b.power) {
        return a.power - b.power
      }
    }
    if (a.cardType === 'SPELL') {
      if (b.cardType !== 'SPELL') return 1
    }
    if (a.cid !== b.cid) {
      return a.cid - b.cid
    }
    return aIdx - bIdx
  })
}
