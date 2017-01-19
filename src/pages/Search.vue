<script>

import DeckTemplate from 'components/DeckTemplate'
import Searcher from 'js/Searcher.js'

export default {
  components: {
    DeckTemplate,
  },
  created() {
    window.Searcher = new Searcher()
  },
  computed: {
    searchCards() {
      return this.$store.getters.searchCards
    },
  },
  methods: {
    search(event) {
      let q = event.target.value
      let idList = window.Searcher.search(q)
        .map(info => info.pid)
        .slice(0, 20) // preformance consideration
      this.$store.commit('searchCards', idList)
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
      @change="search"
      @keyup="search">
    <div id="div-search-results">
      <DeckTemplate :deck="searchCards"></DeckTemplate>
      <div id="search-show-more" style="display: none;">显示更多</div>
    </div>
  </section>
</template>

<style scoped>

</style>