<script>
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import Cell from 'components/Cell'
import Searcher from 'js/Searcher.js'
import marked from 'marked'

let requestFrame = window.requestIdleCallback || window.requestAnimationFrame
let cancelRequest = window.cancelIdleCallback || window.cancelAnimationFrame

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
    searchTips: require('./searchTips.md'), // test
    emptyTips: require('./emptyTips.md'), // test

    index: 0,
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
            // this.start = 0 // reinitialize view
            // this.end = 10
          }, 500)
          return
        }

        this.updateQueryPart({
          query,
        })
        window.scrollTo(0, 0)
        // this.start = 0
        // this.end = 10
        this.blocking = true
        this.timer = setTimeout(() => {
          this.blocking = false
        }, 500)
      },
    },
    matchedCards() {
      return Searcher.search(this.query)
    },
    shownCards() {
      return this.matchedCards.slice(this.start, this.end)
    },
    frontCount() {
      return this.start
    },
    backCount() {
      return this.matchedCards.length - this.frontCount - this.shownCards.length
    },
    start() {
      return Math.max(0, this.index - 10)
    },
    end() {
      return Math.min(this.matchedCards.length, this.index + 10)
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
      // auto update searchIndex & will be viewed cards
      let $list = this.$refs.list
      if ($list) {
        for (let li of $list.children) {
          let rect = li.getBoundingClientRect()
          if (rect.bottom > window.innerHeight
            && rect.top < window.innerHeight) {
            let index = +li.getAttribute('idx')
            if (index !== this.index) {
              this.index = index
              console.log(index)
            }
          }
        }
      }
      this.request = requestFrame(this.updateIndex)
    },
  },
  mounted() {
    // this.initView()
    this.updateIndex()
    if (!this.query) {
      this.$refs.input.focus()
    }
  },
  destroyed() {
    cancelRequest(this.request)
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
      <ul ref="list">
        <li v-for="n in frontCount" :idx="n - 1" key="n - 1">
          <div :class="$style.null" />
        </li>
        <li v-for="(card, idx) in shownCards" :idx="frontCount + idx" key="frontCount + idx">
          <cell :card="card" />
        </li>
        <li v-for="n in backCount" :idx="frontCount + shownCards.length + n - 1" key="frontCount + shownCards.length + n - 1">
          <div :class="$style.null" />
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
.null {
  height: calc(4px + 2*var(--padding) + 6.25rem);
  border-bottom: 1px solid var(--cell-border-color);
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
