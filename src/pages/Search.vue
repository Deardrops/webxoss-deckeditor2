<script>

import CardsTemplate from 'components/CardsTemplate'
import Searcher from 'js/Searcher.js'
import ImageManager from 'js/ImageManager.js'

export default {
  components: {
    CardsTemplate,
  },
  computed: {
    matchedCards() {
      return Searcher.search(this.$store.state.query)
        .map(info => ({
          pid: info.pid,
          info,
          count: 1,
          img: ImageManager.getUrlByPid(info.pid),
        }))
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
      <CardsTemplate :deck="shownCards"></CardsTemplate>
      <div id="search-show-more" style="display: none;">显示更多</div>
    </div>
  </section>
</template>

<style scoped>

</style>