<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import ListContainer from 'components/ListContainer'
import Block from 'components/Block'
import CardImage from 'components/CardImage'
import Searcher from 'js/Searcher.js'
import { defaultSort } from 'js/util'
import Icon from 'components/Icon'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    ListContainer,
    Block,
    CardImage,
    Icon,
  },
  data: () => ({
    queryString: 's',
    timer: -1,
    blocking: false,
  }),
  computed: {
    ...mapState([
      'deckName',
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
  <div :class="$style.page">
<!--     <div :class="$style.nav">
      <div>WHITE HOPE</div>
      <div>RED AMBITION</div>
      <div>BLUE APPLI</div>
      <div>GREEN WANNA</div>
      <div>BLACDESIRE</div>
      <div>BLUE REQUEST</div>
    </div> -->
    <div>
      <div :class="$style.panel">
      </div>
      <div :class="$style.container">
        <div :class="$style.content">
          <div :class="$style.header">
            <div :class="$style.deckName">{{ deckName }}</div>
            <div :class="$style.empty"></div>
            <input
              :class="$style.searchBar"
              placeholder="Search..."
              spellcheck="false"
              autocomplete="off"
              autocapitalize="none"
              maxlength="30"
              v-model="query"/>
          </div>
          <div :class="$style.flex">
            <div :class="$style.blocks">
              <!-- <div>MainDeck</div> -->
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
            <div :class="$style.searchZone" ref="scrollDiv">
              <list-container
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
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.sidebar">
    </div>
  </div>
</template>

<style module>
@import 'css/vars.css';
.page {
  /*padding-left: 256px;*/
  background-color: #fafafa;
}
.flex {
  display: flex;
}
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 256px;
  height: 100vh;
  font-size: 1.2em;
  border-right: 2px solid var(--cell-border-color);
  padding-top: 20rem;
  &>div {
    width: 10em;
    padding: .2em 1em;
  }
}
.panel {
  height: 20rem;
  background-color: var(--main-color);
}
.header {
  display: flex;
  /*height: 10rem;*/
  padding: 1em 0;
  color: #000;
  font-size: 1.5em;
}
.deckName {
  padding-left: 3rem;
}
.container {
  /*padding-right: calc(256px + 3rem);*/
}
.content {
  position: relative;
  top: -10rem;
  width: 60%;
  margin: 0 auto;
  background-color: #fafafa;
  @apply --shadow-8dp;
}
.blocks {
  padding: 2em;
  flex: 1;
}
.deckBlock {
  width: 10%;
}
.sidebar {
  position: fixed;
  top: 10rem;
  right: 3rem;
  width: 256px;
  /*border-left: 2px solid var(--cell-border-color);*/
  background-color: #fafafa;
  z-index: 1;
}
.empty {
  flex: 1;
}
.searchBar {
  color: #fff;
  /*background-color: #fafafa;*/
  border-radius: 3px;
  /*margin: .5em;*/
  height: 2rem;
  margin-right: 1rem;
  width: calc(6rem);
  padding-left: .5em;
  background-color: #eee;
  /*background-color: color(var(--main-color) l(+10%));*/
  /*@apply --shadow-4dp;*/
}
.searchBar::placeholder {
  color: #000;
}
.searchBar::selection {
  color: #333;
  background-color: #ffff00;
}
.searchZone {
  padding: 2rem 1rem;
  width: 6rem;
  height: calc(100vh - 3em);
  overflow-y: auto;
  /*margin: 0 .5em;*/
  /*@apply --shadow-8dp;*/
}
.searchBlock {
  /*padding: .2rem 1rem;*/
  width: 100%;
}
</style>
