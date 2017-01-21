<script>
import { mapGetters } from 'vuex'
import Cell from 'components/Cell'

export default {
  components: {
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
    showSeach() {
      this.$router.push('/search')
    },
  },
}
</script>

<template>
  <div>
    <nav class="nav-bar" @click="showSeach">
    <!-- <nav class="nav-bar" > -->
      <button tabindex="0" type="button" class="nav-button"><div>
      <svg viewBox="0 0 24 24" style="display: inline-block; color: rgb(255, 255, 255); fill: rgb(255, 255, 255); height: 24px; width: 24px; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; user-select: none;"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg></div>
      </button>
      <h1 class="deck-name"><a>{{ deckName }}</a></h1>
    </nav>
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
    <div class="lrig-deck-zone">
      <li v-for="card in unique(lrigDeck)">
        <cell
          :card="card"
          :count="getCount(card, lrigDeck)"
          @plus="add(card)"
          @minus="del(card)">
        </cell>
      </li>
    </div>
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