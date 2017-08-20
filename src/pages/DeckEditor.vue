<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import ListContainer from 'components/ListContainer'
import Block from 'components/Block'
import CardImage from 'components/CardImage'
import Searcher from 'js/Searcher.js'
import { defaultSort } from 'js/util'
import Icon from 'components/Icon'
import CardInfo from 'components/CardInfo'
import DeckHead from 'components/DeckHead'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    ListContainer,
    Block,
    CardImage,
    Icon,
    CardInfo,
    DeckHead,
  },
  data: () => ({
    queryString: 's',
    timer: -1,
    blocking: false,
  }),
  computed: {
    ...mapState([
      'deckName',
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
  <div :class="$style.container">
    <div :class="$style.infoZone">
      <card-info />
    </div>
    <div :class="$style.deckZone">
      <div :class="$style.header">
        <div :class="$style.deckName">{{ deckName }}</div>
      </div>

      <deck-head />
      <div :class="$style.mainDeck">
        <block
          v-for="card in sortedMainDeck"
          :class="$style.deckBlock"
          :card="card"
          @click="delCard"/>
      </div>
      <deck-head :lrig="true" />
      <div :class="$style.lrigDeck">
        <block
          v-for="card in sortedLrigDeck"
          :class="$style.deckBlock"
          :card="card"
          @click="delCard"/>
      </div>
    </div>
    <div :class="$style.searchZone">
      <input
        :class="$style.searchBar"
        placeholder="Search..."
        spellcheck="false"
        autocomplete="off"
        autocapitalize="none"
        maxlength="30"
        v-model="query"/>
      <div :class="$style.result" ref="result">
        <list-container
          :cards="matchedCards"
          :longListOpimizationEnabled="true"
          :desktopView="true">
          <template scope="props">
            <block
              :class="$style.searchBlock"
              :card="props.card"
              @click="addCard" />
          </template>
        </list-container>
      </div>
    </div>
  </div>
</template>

<style module>
@import 'css/vars.css';
:root {
  --card-width: 3.5rem;
  --card-height: 4.886rem;
}
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #fafafa;
  @apply --shadow-8dp;
}
.infoZone {
  max-height: 100vh;
  width: calc(var(--card-width) * 4);
  overflow-y: auto;
  padding: .5em;
}
.deckZone {
  width: calc(var(--card-width) * 10);
  max-height: 100vh;
}
.header {
  min-height: 3rem;
}
.deckName {
  font-size: 2rem;
}
.searchZone {
  padding: 0 .5em;
  width: calc(var(--card-width) * 3);
}
.deckBlock {
  width: var(--card-width);
}
.searchBar {
  display: block;
  height: 2rem;
  width: calc(100% - 1rem);
  margin: .5em;
  color: #000;
  box-sizing: border-box;
  padding-left: 1em;
  text-overflow: clip;
  background-color: #eee;
}
.searchBar::placeholder {
  color: #666;
}
.searchBar::selection {
  color: #000;
  background-color: #2196f3;
}
.result {
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
}
.searchBlock {
  width: 80%;
}
</style>
