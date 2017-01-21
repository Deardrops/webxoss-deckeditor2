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

function isLrigCard (card) {
  let type = card.cardType
  return (type === 'LRIG') || (type === 'ARTS') || (type === 'RESONA')
}

Vue.use(Vuex)

const state = {
  currentDeckName: '牌组名称（点击跳转搜索）',

  deckFilenames: [],

  // current deck, an array of cards' pid
  deckPids: [],

  // TODO: use vue-router
  isDeckView: true,
  isSearchView: false,

  // bind to search bar's user input
  query: '',
}

const getters = {
  // a `deck` is an array of cards
  deck: state => {
    return state.deckPids.map(pid => CardInfo[pid])
  },
  mainDeck: (state, getters) => {
    return getters.deck.filter(card => !isLrigCard(card))
  },
  lrigDeck: (state, getters) => {
    return getters.deck.filter(card => isLrigCard(card))
  },

  deckName: state => {
    return state.currentDeckName
  },
}


const mutations = {
  addCard(state, pid) {
    state.deckPids.push(pid)
    defaultSort(state.deckPids)
  },
  delCard(state, pid) {
    let idx = state.deckPids.findIndex(id => id === pid)
    state.deckPids.splice(idx, 1)
  },
  fillDeck(state, pids) {
    state.deckPids = pids
  },
  changeToSearchView(state) {
    state.isDeckView = false
    state.isSearchView = true
  },
  search(state, query) {
    state.query = query
  },
}
const store = new Vuex.Store({
  state,
  mutations,
  getters,
  strict: process.env.NODE_ENV !== 'production',
})

export default store
