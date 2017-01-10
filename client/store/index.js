import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  count: 0,
  deck_filenames: [],
  deck_file: {},
  mainData: {
    deck: 'main',
    limit: 50,
    deckObjs: []
  },
  lrigData: {
    deck: 'lrig',
    limit: 20,
    deckObjs: []
  }
}

const mutations = {
  //增加或者删除卡片
  INCREMENT(state) {
    state.count++
  },
  DECREMENT(state) {
    state.count--
  }
}

const getters = {

}

const actions = {
  incrementAsync({ commit }) {
    setTimeout(() => {
      commit('INCREMENT')
    }, 200)
  },
  initDeck({ commit }) {
    for (let pid of state.deck_file.mainDeck) {
      let Objs = state.mainData.deckObjs;
      Objs.push({
        pid: pid,
        idx: Objs.length,
        info: '', // CardInfo[pid]
        img: null
      })
    }
    for (let pid of state.deck_file.lrigDeck) {
      let Objs = state.lrigData.deckObjs;
      Objs.push({
        pid:pid,
        idx: Objs.length,
        info: '', // CardInfo[pid]
        img: null
      })
    }
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
