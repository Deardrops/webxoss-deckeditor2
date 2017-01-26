<script>
import { mapGetters } from 'vuex'
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import Cell from 'components/Cell'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    Cell,
  },
  created() {
    this.$store.commit('fillDeck', require('./WHITE_HOPE.json'))
  },
  computed: {
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
      'deckName',
    ]),
  },
  methods: {
    unique(deck) {
      let map = {}
      deck.forEach(card => map[card.pid] = card)
      return Object.keys(map).map(key => map[key])
    },
    getCount(target, deck) {
      return deck.filter(card => card.pid === target.pid).length
    },
    add(card) {
      this.$store.commit('addCard', card.pid)
    },
    del(card) {
      this.$store.commit('delCard', card.pid)
    },
    goSearch() {
      this.$router.push({
        path: '/search',
        query: {
          limit: 20,
        },
      })
    },
  },
}
</script>

<template>
  <div>
    <app-header title="Deck Editor">
      <header-icon slot="right" name="search" @click.native="goSearch"/>
    </app-header>
    <div class="main-deck-text-bar">
      <span class="main-deck-title">主卡组</span>
    </div>
    <ul class="main-deck-zone">
      <li v-for="card in unique(mainDeck)">
        <cell
          :card="card"
          :count="getCount(card, mainDeck)"
          @plus="add(card)"
          @minus="del(card)">
        </cell>
      </li>
    </ul>
    <div class="lrig-deck">
      <div class="lrig-deck-text-bar">
        <span class="lrig-deck-title">LRIG卡组</span>
      </div>
    <ul class="lrig-deck-zone">
      <li v-for="card in unique(lrigDeck)">
        <cell
          :card="card"
          :count="getCount(card, lrigDeck)"
          @plus="add(card)"
          @minus="del(card)">
        </cell>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.main-deck-text-bar,
.lrig-deck-text-bar {
  text-align: center;
}
.main-deck-zone,
.lrig-deck-zone {
  width: 100%;
  margin: 0 auto;
}

/* test use */
.nav-bar {
  color: rgba(0, 0, 0, 0.870588);
  background-color: #2196f3;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
  border-radius: 0px;
  position: relative;
  z-index: 1100;
  width: 100%;
  display: flex;
  padding-left: 24px;
  padding-right: 24px;
}
.nav-button {
  border: 10px;
  box-sizing: border-box;
  display: inline-block;
  cursor: pointer;
  text-decoration: none;
  margin: 8px 8px 0px -16px;
  padding: 12px;
  outline: none;
  font-size: 0px;
  font-weight: inherit;
  position: relative;
  overflow: visible;
  width: 48px;
  height: 48px;
  background: none;
}
.deck-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0px;
  padding-top: 0px;
  letter-spacing: 0px;
  font-size: 24px;
  font-weight: 400;
  color: #ffffff;
  height: 64px;
  line-height: 64px;
  flex: 1 1 0%;
}
</style>