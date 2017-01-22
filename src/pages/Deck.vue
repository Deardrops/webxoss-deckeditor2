<script>
import { mapGetters } from 'vuex'
import Cell from 'components/Cell'
import Icon from 'components/Icon'

export default {
  components: {
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
      <button tabindex="0" type="button" class="nav-button">
        <icon name="menu"/>
      </button>
      <h1 class="deck-name"><a>{{ deckName }}</a></h1>
    </nav>
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
  background-color: #2196f3;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
  display: flex;
  padding-left: 24px;
  padding-right: 24px;
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