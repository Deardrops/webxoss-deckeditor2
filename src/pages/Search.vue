<script>
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import Cell from 'components/Cell'
import Searcher from 'js/Searcher.js'
import marked from 'marked'

// 8rem
let cellHeight = 8

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
    request: -1,

    /*
      Long list optimization.

      Only render card cells in viewport.
      Cells outside viewport are replaced with list padding.

      `index`:
        The index of the top cell in viewport.
        It's automatically set when scrolling.
        See `updateIndex` for details.
    */
    index: 0,

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
            this.updateQueryPart({
              query,
            })
            this.blocking = false
            window.scrollTo(0, 0)
          }, 500)
          return
        }

        this.updateQueryPart({
          query,
        })
        window.scrollTo(0, 0)
        this.blocking = true
        this.timer = setTimeout(() => {
          this.blocking = false
        }, 500)
      },
    },
    matchedCards() {
      return Searcher.search(this.query)
    },
    start() {
      // 5 cards before index
      return Math.max(0, this.index - 5)
    },
    end() {
      // 10 cards after index
      return Math.min(this.matchedCards.length, this.index + 10)
    },
    shownCards() {
      return this.matchedCards.slice(this.start, this.end)
    },
    padding() {
      // Paddings before / after shown cells.
      // They keep list height and scroll position from changing。
      let beforeCount = this.start
      let afterCount = this.matchedCards.length - beforeCount - this.shownCards.length
      return {
        'padding-top': `${cellHeight * beforeCount}rem`,
        'padding-bottom': `${cellHeight * afterCount}rem`,
      }
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
    updateIndex() {
      // Find the top cell in viewport according to `window.scrollY`.
      let $list = this.$refs.list
      if ($list) {
        let fontSize = +window.getComputedStyle(window.document.body)
          .fontSize.slice(0, -2)
        this.index = Math.round(window.scrollY / (cellHeight * fontSize))
      }
      this.request = requestIdleCallback(this.updateIndex)
    },
  },
  mounted() {
    this.updateIndex()
    if (!this.query) {
      this.$refs.input.focus()
    }
  },
  destroyed() {
    cancelIdleCallback(this.request)
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
      <ul ref="list" :style="padding">
        <li v-for="card in shownCards">
          <cell :card="card" />
        </li>
      </ul>
    </section>
    <section :class="$style.tips" v-if="!query">
      <div v-html="marked(searchTips)"></div>
    </section>
    <section :class="$style.tips" v-if="query && !shownCards.length">
      <div v-html="marked(emptyTips)"></div>
    </section>
  </div>
</template>

<style module>
@import 'css/vars.css';
.search {
  flex: 1;
  color: #fff;
  padding: .3em .5em;
  background-color: color(var(--main-color) l(+10%));
  border-radius: 3px;
}
.search::placeholder {
  color: #fffa;
}
.search::selection {
  color: #333;
  background-color: #ffff00;
}
.tips {
  padding: 2rem 2rem 0 2rem;
  color: #666;
  line-height: 1.5;

  & h3 {
    font-size: 1.5em;
  }

  & p,
  & ul {
    margin: .5em 0; 
  }

  & ul {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 2em;
  }

  & code {
    margin: 0 .2em;
    font-family: monospace;
    white-space: nowrap;
    border-bottom: 1px dotted #333;
  }
}
</style>
