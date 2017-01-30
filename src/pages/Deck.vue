<script>
import { mapGetters } from 'vuex'
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import Cell from 'components/Cell'
import DeckHead from 'components/DeckHead'
import _ from 'lodash'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    Cell,
    DeckHead,
  },
  computed: {
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
    ]),
  },
  methods: {
    unique: deck => _.uniqBy(deck, 'pid'),
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
    <deck-head></deck-head>
    <ul>
      <li v-for="card in unique(mainDeck)">
        <cell :card="card"/>
      </li>
    </ul>
    <ul>
      <li v-for="card in unique(lrigDeck)">
        <cell :card="card"/>
      </li>
    </ul>
  </div>
</template>

<style module>
</style>