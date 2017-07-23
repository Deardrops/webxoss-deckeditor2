<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import ListContainer from 'components/ListContainer'
import Block from 'components/Block'
import CardImage from 'components/CardImage'
import Searcher from 'js/Searcher.js'
import { defaultSort } from 'js/util'
import Icon from 'components/Icon'
import CardInfoTable from 'components/CardInfoTable'
import Localize from 'js/Localize'
import Card from 'components/Card'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    ListContainer,
    Block,
    CardImage,
    Icon,
    CardInfoTable,
    Card,
  },
  data: () => ({
    queryString: 's',
    timer: -1,
    blocking: false,
    sidebarVisible: false,
    resultVisible: false,
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
    shownCard() {
      return CardInfo[this.shownPid]
    },
    shownCardName() {
      return Localize.cardName(this.shownCard)
    },
    shownCardLimiting() {
      return Localize.limiting(this.shownCard)
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
    setAsShownCard(pid) {
      this.openSidebar()
      this.$store.commit('setShownPid', pid)
    },
    openSidebar() {
      this.sidebarVisible = true
    },
    closeSidebar() {
      this.sidebarVisible = false
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
  watch: {
    query(str) {
      if (str) {
        this.resultVisible = true
      } else {
        this.resultVisible = false
      }
    },
  },
}
</script>

<template>
  <div>
    <div :class="$style.nav">
      <div :class="$style.flexCenter">
        <a :class="$style.title"> WEBXOSS </a>
      </div>
      <div :class="$style.decks">
        <div>WHITE HOPE</div>
        <div>RED AMBITION</div>
        <div>BLUE APPLI</div>
        <div>GREEN WANNA</div>
        <div>BLACDESIRE</div>
        <div>BLUE REQUEST</div>
      </div>
    </div>
    <div>
      <app-header>
        <div slot="left" style="width: 15%;" />
        <input
          :class="$style.searchBar"
          placeholder="Search..."
          spellcheck="false"
          autocomplete="off"
          autocapitalize="none"
          maxlength="30"
          v-model="query"/>
        <header-icon slot="right" name="blocks"/>
        <div slot="right" style="width: 15%;"/>
      </app-header>
      <div :class="$style.container" @click="closeSidebar">
        <div v-show="resultVisible" :class="$style.content">
          <div :class="$style.cards">
            <card
              v-for="card in matchedCards.slice(0,50)"
              :card=card
              actionType="add"
              @click="setAsShownCard"
              @action="addCard" />
          </div>
        </div>
        <div v-show="!resultVisible" :class="$style.content">
          <div :class="$style.cards">
            <card
              v-for="card in sortedMainDeck"
              :card=card
              :class="$style.card"
              actionType="remove"
              @click="setAsShownCard"
              @action="delCard" />
          </div>
          <div :class="$style.cards">
            <card
              v-for="card in sortedLrigDeck"
              :card=card
              :class="$style.card"
              actionType="remove"
              @click="setAsShownCard"
              @action="delCard">
            </card>
          </div>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div v-show="sidebarVisible" :class="$style.sidebar">
        <card-image :class="$style.image" :pid="shownPid"/>
        <div style="display: flex;">
          <span>{{ shownCard.wxid }}</span>
          <span style="margin-left: auto;">{{ shownCardLimiting }}</span>
        </div>
        <div style="font-size: 1.5em;">{{ shownCardName }}</div>
        <card-info-table :card="shownCard"/>
      </div>
    </transition>
  </div>
</template>

<style module>
@import 'css/vars.css';
.nav {
  position: fixed;
  z-index: var(--z-nav);
  top: 0;
  left: 0;
  width: 15%;
  height: 100vh;
  font-size: 1.2em;
  box-shadow: 0 0 4px rgba(0,0,0,.14), 2px 4px 8px rgba(0,0,0,.28);
  background-color: #fff;
}
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-bottom: 1px solid var(--cell-border-color);
}
.title {
  font-size: 1.5rem;
  color: var(--main-color);
}
.decks {
  color: #757575;
  padding: 1em 1em;
  &>div {
    padding: .3em 0;
  }
}
.searchBar {
  flex: 1;
  color: #fff;
  padding: .3em .5em;
  margin-left: 2em;
  margin-right: 40%;
  background-color: color(var(--main-color) l(+10%));
  border-radius: 3px;
}
.searchBar::placeholder {
  color: #fffa;
}
.searchBar::selection {
  color: #333;
  background-color: #ffff00;
}
.container {
  margin-left: 15%;
  margin-right: 15%;
}
.content {
  margin-left: 2em;
  background-color: #fafafa;
}
.cards {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.sidebar {
  position: fixed;
  z-index: var(--z-sidebar);
  top: 4rem;
  right: 0;
  width: 20%;
  height: calc(100% - 4rem);
  background-color: #fafafa;
  overflow-y: auto;
  box-shadow: -2px 0 4px 0 rgba(0, 0, 0, .15);
  transition: transform 0.3s, right 0.3s;
  padding: .5em;
}
.image {
  width: 80%;
  display: block;
  margin: 0 auto;
}
</style>
