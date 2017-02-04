<script>
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import Cell from 'components/Cell'
import Searcher from 'js/Searcher.js'
import marked from 'marked'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    Cell,
  },
  data: () => ({
    // To improve performance when user typing,
    // block the search for a short time after input.
    timer: -1,
    blocking: false,
    searchTips: require('./searchTips.md'), // test
    emptyTips: require('./emptyTips.md'), // test
  }),
  computed: {
    query: {
      get() {
        return this.$route.query.query || ''
      },
      set(query) {
        if (this.blocking) {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.updateQueryPart({ query })
            this.blocking = false
          }, 500)
          return
        }

        this.updateQueryPart({ query })
        this.blocking = true
        this.timer = setTimeout(() => {
          this.blocking = false
        }, 500)
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
    marked,
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
    if (!this.query) {
      this.$refs.input.focus()
    }
  },
}
</script>

<template>
  <div>
    <app-header title="Search">
      <input
        :class="$style.search"
        placeholder="Search..."
        spellcheck="false"
        autocomplete="off"
        autocapitalize="none"
        maxlength="30"
        ref="input"
        v-model="query">
      <header-icon name="more"/>
    </app-header>
    <section v-if="query && shownCards.length">
      <ul>
        <li v-for="card in shownCards">
          <cell :card="card" />
        </li>
      </ul>
      <div
        v-if="shownCards.length < matchedCards.length"
        :class="$style.more">
        <button @click="showMore(20)">Show more</button>
      </div>
    </section>
    <section v-if="!query">
      <div v-html="marked(searchTips)"></div>
    </section>
    <section v-if="query && !shownCards.length">
      <div v-html="marked(emptyTips)"></div>
    </section>
  </div>
</template>

<style module>
@import 'css/vars.css';
.search {
  flex: 1;
  color: #fff;
  line-height: var(--header-height);
}
.search::placeholder {
  color: #fffa;
}
.search::selection {
  color: #333;
  background-color: #ffff00;
}
.more {
  text-align: center;
  font-size: 2em;
  padding: 1em 0;
}
</style>