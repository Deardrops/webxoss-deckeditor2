import Vue from 'vue'
import Vuex from 'vuex'

import ImageManager from '../ImageManager.js'

function getUniqueCards(deck) {
  //unique card with its count
  let uniqueCards = []
  deck.forEach(card => {
    for (let uniqueCard of uniqueCards) {
      if (card.pid === uniqueCard.pid) {
        uniqueCard.count++
        return
      }
    }
    let uniqueCard = card
    uniqueCard.count = 1
    uniqueCards.push(uniqueCard)
  })
  return uniqueCards
}

function defaultSort(cards){
  // default order:
  // LRIG > ARTS > RESONA > SIGNI > SPELL
  // level / power: high > low
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
  let type = CardInfo[pid].cardType
  return (type  === 'LRIG') || (type  === 'ARTS')
}

Vue.use(Vuex)

const state = {
  currentDeckName: '牌组名称（点击跳转搜索）',
  deckFilenames: [],
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
  fillDeck(state, payload) {
    state.deckIdList = payload
  },
  changeToSearchView(state) {
    state.isDeckView = false
    state.isSearchView = true
  },
}

const getters = {
  mainCards: state => {
    let mainIdList = state.deckIdList.filter(pid => !isLrigCard(pid))
    return mainIdList.map(pid => {
      return {
        pid: pid,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      }
    })
  },
  lrigCards: state => {
    let lrigIdList = state.deckIdList.filter(pid => isLrigCard(pid))
    return lrigIdList.map(pid => {
      return {
        pid: pid,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      }
    })
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
