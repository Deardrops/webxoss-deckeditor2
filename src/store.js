import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

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

function isLrigCard(card) {
  let type = card.cardType
  return (type === 'LRIG') || (type === 'ARTS') || (type === 'RESONA')
}

Vue.use(Vuex)

/*
  ## Name Explaination:

  * Pid: the unique numerical id of a physical card
  * Card: the card information object
      {
        pid: 1234,
        name: 'card name',
        ...
      }
  * Deck: an array of cards
  * DeckFile:
      {
        name: 'deck name',
        pids: [],
      }
*/
const state = {
  deckFiles: [],

  // current selected deck name
  deckName: '',
}

const getters = {
  deckPids: ({ deckFiles, deckName }) => {
    return _.chain(deckFiles)
      .find({ name: deckName })
      .get('pids', [])
      .value()
  },

  deck: (state, getters) => {
    return getters.deckPids.map(pid => CardInfo[pid])
  },
  mainDeck: (state, getters) => {
    return getters.deck.filter(card => !isLrigCard(card))
  },
  lrigDeck: (state, getters) => {
    return getters.deck.filter(card => isLrigCard(card))
  },

  deckNames: (state) => {
    return state.deckFiles.map(file => file.name)
  },
}


const mutations = {
  addCard(state, pid) {
    let pids = getters.deckPids(state)
    pids.push(pid)
    defaultSort(pids)
  },
  delCard(state, pid) {
    let pids = getters.deckPids(state)
    let idx = pids.indexOf(pid)
    if (idx === -1) {
      // 404 not found
      return
    }
    pids.splice(idx, 1)
  },
  // put === create + update
  putDeckFile(state, { name, pids }) {
    let file = state.deckFiles.find(file => file.name === name)
    if (file) {
      // Already exist, update
      file.pids = pids
    } else {
      // New file, create
      state.deckFiles.push({
        name,
        pids,
      })
    }
  },
  switchDeck(state, name) {
    state.deckName = name
  },
  deleteDeck(state, name) {
    let idx = state.deckFiles.findIndex(file => file.name === name)
    if (idx === -1) {
      // 404 not found
      return
    }

    // No deck after deleting, put WHITE_HOPE
    if (state.deckFiles.length <= 1) {
      state.deckFiles = [{
        name: 'WHITE_HOPE',
        pids: require('./WHITE_HOPE').slice(),
      }]
      state.deckName = 'WHITE_HOPE'
      return
    }

    state.deckFiles.splice(idx, 1)

    // Deleting current deck, switch to the next one
    // (or the previous one if it's the last)
    if (name === state.deckName) {
      if (idx >= state.deckFiles.length) {
        idx--
      }
      state.deckName = state.deckFiles[idx].name
    }
  },
  renameDeck(state, { origin, name }) {
    // New name already exist
    if (state.deckFiles.some(file => file.name === name)) {
      return
    }

    let file = state.deckFiles.find(file => file.name === origin)
    if (!file) {
      // 404 not found
      return
    }

    file.name = name

    // Renaming current deck, switch to new name
    if (state.deckName === origin) {
      state.deckName = name
    }
  },
}
const store = new Vuex.Store({
  state,
  mutations,
  getters,
  strict: process.env.NODE_ENV !== 'production',
})

export default store
