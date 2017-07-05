<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import ListContainer from 'components/ListContainer'
import Block from 'components/Block'
import CardImage from 'components/CardImage'
import Searcher from 'js/Searcher.js'
import { defaultSort } from 'js/util'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    ListContainer,
    Block,
    CardImage,
  },
  data: () => ({
    queryString: 's',
    timer: -1,
    blocking: false,
  }),
  computed: {
    ...mapState([
      'shownPid',
    ]),
    ...mapGetters([
      'deckPids',
      'mainDeck',
      'lrigDeck',
    ]),
    query: {
      get() {
        return this.queryString
      },
      set(query) {
        if (this.blocking) {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.queryString = query
            this.blocking = false
            this.scrollToTop()
          }, 500)
          return
        }

        this.queryString = query
        this.scrollToTop()
        this.blocking = true
        this.timer = setTimeout(() => {
          this.blocking = false
        }, 500)
      },
    },
    sortedMainDeck() {
      return defaultSort(this.mainDeck)
    },
    sortedLrigDeck() {
      return defaultSort(this.lrigDeck)
    },
    matchedCards() {
      return Searcher.search(this.query)
    },
  },
  methods: {
    delCard(pid) {
      this.$store.commit('delCard', pid)
    },
    addCard(pid) {
      this.$store.dispatch('addCard', pid).then((successed) => {
        if (!successed) {
          console.log('already full') // show toast here
        }
      })
    },
    scrollToTop() {
      if (this.$refs.scrollDiv) {
        this.$refs.scrollDiv.scrollTop = 0
      }
    },
  },
  mounted() {
    this.query = ''
  },
}
</script>

<template>
  <div>
    <app-header>
      <input
        :class="$style.search"
        placeholder="Search..."
        spellcheck="false"
        autocomplete="off"
        autocapitalize="none"
        maxlength="30"
        v-model="query"/>
    </app-header>
    <div :class="$style.container">
      <div :class="$style.searchZone" ref="scrollDiv">
        <list-container
          :columnNumber="5"
          :cards="matchedCards"
          :longListOpimizationEnabled="true">
          <template scope="props">
            <block
              :class="$style.searchBlock"
              :card="props.card"
              @click="addCard"/>
          </template>
        </list-container>
      </div>
      <div :class="$style.deckZone">
        <div :class="$style.blocks">
          <div>MainDeck</div>
          <div>
            <block
              v-for="card in sortedMainDeck"
              :class="$style.deckBlock"
              :card="card"
              @click="delCard"/>
          </div>
          <div>LrigDeck</div>
          <div>
            <block
              v-for="card in sortedLrigDeck"
              :class="$style.deckBlock"
              :card="card"
              @click="delCard"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
@import 'css/vars.css';
.container {
  display: flex;
}
.search {
  flex: .4;
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
.deckZone {
  width: 50%;
  padding: .5em;
}
.deckBlock {
  width: 10%;
}
.searchZone {
  width: 50%;
  height: calc(100vh - var(--header-height));
  overflow: scroll;
}
.searchBlock {
  padding: .3em;
  width: 20%;
}
</style>
