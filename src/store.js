import Vue from 'vue'
import Vuex from 'vuex'

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

  // current deck, an array of cards' pid
  deckIdList: [],

  // TODO: use vue-router
  isDeckView: true,
  isSearchView: false,

  // bind to search bar's user input
  query: '',
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
    return state.deckIdList
      .filter(pid => !isLrigCard(pid))
  },
  lrigCards: state => {
    return state.deckIdList
      .filter(pid => isLrigCard(pid))
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
