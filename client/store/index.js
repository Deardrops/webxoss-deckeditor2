import Vue from 'vue'
import Vuex from 'vuex'

import ImageManager from '../ImageManager.js'

function getUniqueCards(deck) {
  //unique card with its count
  let uniqueCards = []
  for (let card of deck) {
    let flag = false
    for (let uniqueCard of uniqueCards) {
      if (card.pid === uniqueCard.pid) {
        uniqueCard.count++
        flag = true
        break
      }
    }
    if (flag === false) {
      let uniqueCard = card
      uniqueCard.count = 1
      uniqueCards.push(uniqueCard)
    }
  }
  return uniqueCards
}

function defaultSort(cards){
  // default order:
  // LRIG>ARTS>RESONA>SIGNI>SPELL
  // level/power: hight > low
  cards.sort((aPid, bPid) => {
    const a = CardInfo[aPid]
    const b = CardInfo[bPid]
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
    return 1
  })
}

function isLrigCard(pid){
  if (CardInfo[pid].cardType === 'LRIG') {
    return true
  } else if (CardInfo[pid].cardType === 'ARTS') {
    return true
  } else {
    return false
  }
}

Vue.use(Vuex)

const state = {
  currentDeckName: '牌组名称（点击跳转搜索）',
  deckFilenames: [],
  deckIds: {}, //test use
  deckCards: [],
  deckIdList: [],
  isDeckView: true,
  isSearchView: false,
}

const mutations = {
  addCard(state, pid) {
    state.deckIdList.push(pid)
    defaultSort(state.deckIdList)
  },
  delCard(state, pid) {
    let idx = state.deckIdList.findIndex(id => id === pid)
    state.deckIdList.splice(idx, 1)
  },
  fillDeckFile(state, payload) {
    state.deckIds = payload
  },
  initDeck(state) {
    for (let pid of state.deckIds.mainDeck) {
      state.deckIdList.push(pid)
    }
    for (let pid of state.deckIds.lrigDeck) {
      state.deckIdList.push(pid)
    }
  },
  changeToSearchView(state) {
    state.isDeckView = false
    state.isSearchView = true
  },
}

const getters = {
  mainCards: state => {
    let cards = []
    for (let pid of state.deckIdList){
      if (!isLrigCard(pid)){
        cards.push({
          pid: pid,
          info: CardInfo[pid],
          img: ImageManager.getUrlByPid(pid),
        })
      }
    }
    return cards
  },
  lrigCards: state => {
    let cards = []
    for (let pid of state.deckIdList){
      if (isLrigCard(pid)){
        cards.push({
          pid: pid,
          info: CardInfo[pid],
          img: ImageManager.getUrlByPid(pid),
        })
      }
    }
    return cards
  },
  mainDeck: (state, getters) => {
    return getUniqueCards(getters.mainCards)
  },
  lrigDeck: (state, getters) => {
    return getUniqueCards(getters.lrigCards)
  },
  deckName: state => {
    return state.currentDeckName
  },
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
})

export default store
