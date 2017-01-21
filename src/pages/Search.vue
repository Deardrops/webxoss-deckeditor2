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
  <section id="Search" v-show="this.$store.state.isSearchView">
    <input 
      id="search-input" 
      placeholder="输入关键字以搜索" 
      spellcheck="false" 
      autocomplete="off" 
      autocapitalize="none"
      v-model="$store.state.query">
    <div id="div-search-results">
      <cell
        v-for="card in shownCards"
        :card="card"
        :count="0">
      </cell>
      <div id="search-show-more" style="display: none;">显示更多</div>
    </div>
  </section>
</template>

<style scoped>

</style>