import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

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
  remainingPids: [],

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
  shownCards: (state, getters) => {
    return _.uniq(_.concat(getters.deckPids
      .filter(pid => !state.remainingPids.includes(pid)),
        state.remainingPids)).map(pid => CardInfo[pid])
  },

  deckNames: (state) => {
    return state.deckFiles.map(file => file.name)
  },
}


const mutations = {
  addCard(state, pid) {
    let pids = getters.deckPids(state)
    pids.push(pid)

    let idx = state.remainingPids.indexOf(pid)
    if (idx !== -1) {
      state.remainingPids.splice(idx, 1)
    }
  },
  delCard(state, pid) {
    let pids = getters.deckPids(state)
    let idx = pids.indexOf(pid)
    if (idx !== -1) {
      pids.splice(idx, 1)
    }

    if (!pids.includes(pids)) {
      let remainingPids = state.remainingPids
      if (remainingPids.includes(pid)){
        let idx = remainingPids.indexOf(pid)
        remainingPids.splice(idx, 1)
      } else {
        state.remainingPids.push(pid)
      }
    }
  },
  clearRemainingPids(state) {
    state.remainingPids = [] // clearRemainingPids
  },
  // put === create + update
  putDeckFile(state, { name, pids }) {
    state.remainingPids = [] // clearRemainingPids
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
    state.remainingPids = [] // clearRemainingPids
    state.deckName = name
  },
  deleteDeck(state, name) {
    state.remainingPids = [] // clearRemainingPids
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
