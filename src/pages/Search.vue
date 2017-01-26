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
        return this.$route.query.query || ''
      },
      set(query) {
        this.updateQueryPart({
          query,
        })
      },
    },
    limit: {
      get() {
        return +this.$route.query.limit || 0
      },
      set(limit) {
        this.updateQueryPart({
          limit,
        })
      },
    },
    matchedCards() {
      return Searcher.search(this.query)
    },
    shownCards() {
      return this.matchedCards.slice(0, this.limit)
    },
  },
  methods: {
    updateQueryPart(part) {
      let query = Object.assign({}, this.$route.query, part)
      Object.keys(query).forEach(key => {
        if (!query[key]) {
          delete query[key]
        }
      })
      this.$router.replace({
        path: this.$route.path,
        query,
      })
    },
    showMore(count) {
      this.limit = this.limit + count
    },
  },
  mounted() {
    this.$refs.input.focus()
  },
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
      <div
        v-if="shownCards.length < matchedCards.length"
        :class="$style.more">
        <button @click="showMore(20)">Show more</button>
      </div>
    </section>
  </div>
</template>

<style module>
.more {
  text-align: center;
  font-size: 2em;
  padding: 1em 0;
}
</style>