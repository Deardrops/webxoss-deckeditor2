import Vue from 'vue'
import Vuex from 'vuex'

import ImageManager from '../ImageManager.js'
import CardInfo from '../CardInfo.js'

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
  mainDeck: state=>{
    let Deck = [];
    for (let card of state.mainData.deckObjs){
      let flag = false;
      for (let Zcard of Deck){
        if (card.pid == Zcard.pid){
          Zcard.count++;
          flag = true;
          break;
        }
      }
      if (flag == false){
        //首次添加
        let Zcard = card;
        Zcard.count = 1;
        Deck.push(Zcard);
      }
    }
    return Deck
  },
  lrigDeck: state=>{
    let Deck = [];
    for (let card of state.lrigData.deckObjs){
      let flag = false;
      for (let Zcard of Deck){
        if (card.pid == Zcard.pid){
          Zcard.count++;
          flag = true;
          break;
        }
      }
      if (flag == false){
        let Zcard = card;
        Zcard.count = 1;
        Deck.push(Zcard);
      }
    }
    return Deck
  }
}

const actions = {
  initDeck({ commit }) {
    for (let pid of state.deck_file.mainDeck) {
      let Objs = state.mainData.deckObjs;
      Objs.push({
        pid: pid,
        idx: Objs.length,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid)
      })
    }
    for (let pid of state.deck_file.lrigDeck) {
      let Objs = state.lrigData.deckObjs;
      Objs.push({
        pid:pid,
        idx: Objs.length,
        info: CardInfo[pid],
        img: ImageManager.getUrlByPid(pid)
      })
    }
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

export default store
