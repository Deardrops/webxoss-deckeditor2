import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import { isLrigCard } from 'js/util'
import Localize from 'js/Localize'
import { setLanguegeCardInfo } from 'js/CardInfoManager'
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

  localization: {
    lang: 'en',
  },

  windowWidth: 0,

  tempDeck: {
    name: '',
    pids: [],
  },
}

Localize.config = state.localization

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
  deckFileJson: (state, getters) =>{
    return JSON.stringify({
      format: 'WEBXOSS Deck',
      version: '1',
      content: {
        mainDeck: getters.mainDeck.map(card => card.pid),
        lrigDeck: getters.lrigDeck.map(card => card.pid),
      },
    })
  },
}

const mutations = {
  addCard(state, pid) {
    if (!pid) {
      return
    }
    let pids = getters.deckPids(state)
    pids.push(pid)
  },
  delCard(state, pid) {
    let pids = getters.deckPids(state)
    let idx = pids.indexOf(pid)
    if (idx !== -1) {
      pids.splice(idx, 1)
    }
  },
  addRemainingCard(state, pid) {
    if (!state.remainingPids.includes(pid)) {
      state.remainingPids.push(pid)
    }
  },
  delRemainingCard(state, pid) {
    let idx = state.remainingPids.indexOf(pid)
    if (idx !== -1) {
      state.remainingPids.splice(idx, 1)
    }
  },
  // put === create + update
  putDeckFile(state, { name, pids }) {
    state.remainingPids = []
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
    state.remainingPids = []
    state.deckName = name
  },
  deleteDeck(state, name) {
    state.remainingPids = []
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
  setTempDeck(state, { name, pids }) {
    if (!pids) {
      return
    }
    state.tempDeck = {
      name,
      pids,
    }
  },
  changeLanguage(state, lang) {
    localStorage.setItem('language', lang)
    // compatible with old webxoss client
    if (lang === 'zh_CN') {
      lang = 'zh_Hans'
    } else if (lang === 'zh_TW') {
      lang = 'zh_Hant'
    }
    state.localization.lang = lang
    setLanguegeCardInfo(lang)
  },
  changeWindowWidth(state, width) {
    state.windowWidth = width
  },
}

const actions = {
  addCard({getters, commit}, pid) {
    let isMainCard = !isLrigCard(CardInfo[pid])
    return new Promise((resolve) => {
      if (isMainCard && getters.mainDeck.length < 50) {
        commit('addCard', pid)
        resolve(true)
      }
      if (!isMainCard && getters.lrigDeck.length < 20) {
        commit('addCard', pid)
        resolve(true)
      }
      resolve(false)
    })
  },
}
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production',
})

// watch deck change && save to localStorage immediately
store.watch((state, getters) => {
  if (!getters.deckNames || !getters.deckNames.length) {
    return
  }
  localStorage.setItem('deck_filenames', JSON.stringify(getters.deckNames))

  let file = {
    mainDeck: getters.mainDeck.map(card => card.pid),
    lrigDeck: getters.lrigDeck.map(card => card.pid),
  }
  if (!state.deckName || !state.deckName.length) {
    return
  }
  let deckName = `deck_file_${state.deckName}`
  localStorage.setItem(deckName, JSON.stringify(file))
})

window.addEventListener('resize', () => {
  store.commit('changeWindowWidth', window.innerWidth)
}, false)

export default store
