<script>

import Cell from 'components/Cell'
import Searcher from 'js/Searcher.js'

export default {
  components: {
    Cell,
  },
  computed: {
    query: {
      get() {
        return this.$store.state.query
      },
      set(value) {
        this.$store.commit('search', value)
      },
    },
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
  <section>
    <input
      placeholder="输入关键字以搜索"
      spellcheck="false"
      autocomplete="off"
      autocapitalize="none"
      v-model="query">
    <ul>
      <li v-for="card in shownCards">
        <cell :card="card" :count="0"></cell>
      </li>
    </ul>
  </section>
</template>

<style scoped>

</style>