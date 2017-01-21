<script>

import Cell from 'components/Cell'
import Searcher from 'js/Searcher.js'

export default {
  components: {
    Cell,
  },
  computed: {
    matchedCards() {
      return Searcher.search(this.$store.state.query)
    },
    shownCards() {
      return this.matchedCards.slice(0, 20)
    },
  },
}
</script>

<template>
  <section v-show="this.$store.state.isSearchView">
    <input
      placeholder="输入关键字以搜索"
      spellcheck="false"
      autocomplete="off"
      autocapitalize="none"
      v-model="$store.state.query">
    <ul>
      <li v-for="card in shownCards">
        <cell
          v-for="card in shownCards"
          :card="card"
          :count="0">
        </cell>
      </li>
    </ul>
  </section>
</template>

<style scoped>

</style>