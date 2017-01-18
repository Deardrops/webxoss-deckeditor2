<script>
// import Searcher from '../Searcher.js'
import DeckTemplate from 'components/DeckTemplate'
export default {
  components: {
    DeckTemplate,
  },
  computed: {
    searchDeck() {
      // Searcher.search('')
    },
  },
}
</script>

<template>
  <section id="Search" v-show="this.$store.state.isSearchView">
    <input id="search-input" placeholder="输入关键字以搜索" spellcheck="false" autocomplete="off" autocapitalize="none">
    <div id="div-search-results">
      <!-- <DeckTemplate :deck="SearchDeck"></DeckTemplate> -->
      <div id="search-show-more" style="display: none;">显示更多</div>
    </div>
  </section>
</template>

<style scoped>

</style>