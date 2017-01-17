import Vue from 'vue'
import Vuex from 'vuex'

import ImageManager from '../ImageManager.js'

function getDeckWithCount(deckName, state) {
  let deck = (deckName === 'mainDeck')
    ? state.mainCards
    : state.lrigCards
  let deckWithCount = []
  for (let card of deck) {
    let flag = false
    for (let numCard of deckWithCount) {
      if (card.pid === numCard.pid) {
        numCard.count++
        flag = true
        break
      }
    }
    if (flag === false) {
      let numCard = card
      numCard.count = 1
      deckWithCount.push(numCard)
    }
  }
  return deckWithCount
}

function defaultSort(cards){
  // 默认排序：
  // 共鸣精灵>精灵>法术，分身>必杀
  // 高等级>低等级，高力量>低力量
  cards.sort((aObj, bObj) => {
    const a = aObj.info
    const b = bObj.info
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
    return aObj.idx - bObj.idx
  })
}

Vue.use(Vuex)

const state = {
  currentDeckName: 'testOnly',
  deckFilenames: [],
  deckIds: {},
  mainCards: [],
  lrigCards: [],
}

const mutations = {
  addCard(state, card) {
    let pid = card.pid
    if (card.type === 'LRIG' || card.deckName === 'ARTS') {
      state.lrigCards.push({
        pid: pid,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      })
      defaultSort(state.lrigCards)
    } else {
      state.mainCards.push({
        pid: pid,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      })
      defaultSort(state.mainCards)
    }
  },
  delCard(state, card) {
    let idx = ''
    if (card.type === 'LRIG' || card.deckName === 'ARTS') {
      idx = state.lrigCards.findIndex(item => item.pid === card.pid)
      state.lrigCards.splice(idx, 1)
    } else {
      idx = state.mainCards.findIndex(item => item.pid === card.pid)
      state.mainCards.splice(idx, 1)
    }
  },
  fillDeckFile(state, payload) {
    state.deckIds = payload
  },
  initDeck(state) {
    for (let pid of state.deckIds.mainDeck) {
      let cards = state.mainCards
      cards.push({
        pid: pid,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      })
    }
    for (let pid of state.deckIds.lrigDeck) {
      let cards = state.lrigCards
      cards.push({
        pid: pid,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid),
      })
    }
  },
}

const getters = {
  mainDeck: state => {
    return getDeckWithCount('mainDeck', state)
  },
  lrigDeck: state => {
    return getDeckWithCount('lrigDeck', state)
  },
  DeckName: state => {
    return state.currentDeckName
  },
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
})

export default store
