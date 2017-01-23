<script>
import AppHeader from 'components/AppHeader'
import Cell from 'components/Cell'
import Searcher from 'js/Searcher.js'

export default {
  components: {
    AppHeader,
    Cell,
  },
  computed: {
    query: {
      get() {
        return this.$route.query.query
      },
      set(value) {
        if (value) {
          this.$router.replace({
            path: '/search',
            query: {
              query: value,
            },
          })
        } else {
          // Ugly to be `/search?query=`,
          // Show `/search` instead.
          this.$router.replace('/search')
        }
      },
    },
    matchedCards() {
      return Searcher.search(this.query)
    },
    shownCards() {
      return this.matchedCards.slice(0, 20)
    },
  },
  // It breaks page transition. Should focus after transition.
  // mounted() {
  //   this.$refs.input.focus()
  // },
}
</script>

<template>
  <div>
    <app-header title="Search"></app-header>
    <section>
      <input
        placeholder="输入关键字以搜索"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="none"
        ref="input"
        v-model="query">
      <ul>
        <li v-for="card in shownCards">
          <cell :card="card" :count="0"></cell>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>

</style>