<script>
import { mapGetters } from 'vuex'
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import Cell from 'components/Cell'
import Icon from 'components/Icon'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    Cell,
    Icon,
  },
  created() {
    this.$store.commit('fillDeck', require('./WHITE_HOPE.json')) // test use
  },
  computed: {
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
      'deckName',
      'deckNames',
    ]),
    BurstCount() {
      return this.mainDeck.filter(card =>
        card.hasOwnProperty('burstEffectTexts')).length
    },
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
    goSearch() {
      this.$router.push('/search')
    },
  },
}
</script>

<template>
  <div>
    <app-header title="Deck Editor">
      <header-icon slot="right" name="search" @click.native="goSearch"/>
    </app-header>
    <div class="deck-header">
      <form>
        <select>
          <option v-for="name in deckNames" :value="name">{{ name }}</option>
        </select>
      </form>
      <div>saved</div>
      <div><a href="#">Mayu's room</a></div>
      <div>LB:{{ BurstCount }}/20</div>
    </div>
    <div class="main-deck">
      <div class="main-deck-text-bar">
        <span class="main-deck-title">主卡组</span>
      </div>
      <ul class="main-deck-zone">
        <li v-for="card in unique(mainDeck)">
          <cell
            :card="card"
            :count="getCount(card, mainDeck)">
          </cell>
        </li>
      </ul>
    </div>
    <div class="lrig-deck">
      <div class="lrig-deck-text-bar">
        <span class="lrig-deck-title">LRIG卡组</span>
      </div>
    <ul class="lrig-deck-zone">
      <li v-for="card in unique(lrigDeck)">
        <cell
          :card="card"
          :count="getCount(card, lrigDeck)">
        </cell>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.deck-header {
  display: flex;
}
.deck-header div {
  padding-right: 1em;
}
.main-deck-text-bar,
.lrig-deck-text-bar {
  text-align: center;
}
.main-deck-zone,
.lrig-deck-zone {
  width: 100%;
  margin: 0 auto;
}
</style>