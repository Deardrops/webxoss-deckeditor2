<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon, HeaderMenu } from 'components/AppHeader'
import DeckModals from 'components/DeckModals'
import ActionButtonBar from 'components/ActionButtonBar'
import FlexboxContainer from 'components/FlexboxContainer'
import CardInfoTable from 'components/CardInfoTable'
import DeckSubheader from 'components/DeckSubheader'
import CardImage from 'components/CardImage'
import Icon from 'components/Icon'
import Box from 'components/Box'
import { defaultSort } from 'js/util'
import Searcher from 'js/Searcher.js'
import Localize from 'js/Localize'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    HeaderMenu,
    DeckModals,
    ActionButtonBar,
    FlexboxContainer,
    DeckSubheader,
    CardInfoTable,
    CardImage,
    Icon,
    Box,
  },
  data: () => ({
    queryString: '',
    timer: -1,
    blocking: false,
  }),
  computed: {
    ...mapState([
      'shownPid',
      'selectedPids',
    ]),
    ...mapGetters([
      'deckPids',
      'mainDeck',
      'lrigDeck',
      'deckNames',
    ]),
    menuItems() {
      return [
        {
          title: Localize('clone'),
          icon: 'copy',
          action: () => {
            this.openModal('clone')
          },
        },
        {
          title: Localize('import'),
          icon: 'download',
          action: () => {
            alert('Not yet implemented.')
          },
        },
        {
          title: Localize('export'),
          icon: 'upload',
          action: () => {
            alert('Not yet implemented.')
          },
        },
      ]
    },
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
    resultVisible() {
      return !!this.query
    },
    sidebarVisible() {
      return !!this.shownPid
    },
    actionButtonBarVisable() {
      return !!this.selectedPids.length
    },
    deckName: {
      get() {
        return this.$store.state.deckName
      },
      set(name) {
        if (name && !this.deckNames.includes(name)) {
          this.$store.commit('renameDeck', {
            origin: this.deckName,
            name,
          })
        }
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
    shownCardPid() {
      if (0 < this.shownPid && this.shownPid < Object.keys(CardInfo).length) {
        return this.shownPid
      } else {
        return 23
      }
    },
    shownCard() {
      return CardInfo[this.shownCardPid]
    },
    shownCardName() {
      return Localize.cardName(this.shownCard)
    },
    shownCardLimiting() {
      return Localize.limiting(this.shownCard)
    },
  },
  methods: {
    openMenu() {
      this.$refs.menu.open()
    },
    closeMenu() {
      this.$refs.menu.close()
    },
    openModal(type) {
      this.$refs.modals.open(type)
    },
    closeModal() {
      this.$refs.modals.close()
    },
    closeBar() {
      this.$store.commit('clearSelectedPids')
      this.$store.commit('clearShownPid')
    },
    changeDeck(name) {
      this.query = ''
      this.closeBar()
      this.$store.commit('switchDeck', name)
    },
    scrollToTop() {
      window.scrollTo(0, 0)
      if (this.$refs.flexboxContainer) {
        this.$refs.flexboxContainer.resetRows()
      }
    },
    L(text) {
      return Localize(text)
    },
  },
}
</script>

<template>
  <div>
    <div :class="$style.nav">
      <div :class="$style.flexCenter">
        <a href="#" :class="$style.title"> WEBXOSS </a>
      </div>
      <div :class="$style.flexCenter">
        <button @click="openModal('add')" :class="[$style.mainColor, $style.button]">
          {{ L('new_deck') }}
        </button>
      </div>
      <div :class="$style.navList">
        <a v-for="name in deckNames" @click="changeDeck(name)">
          <div :class="[$style.navItem, name === deckName ? $style.navItemSelected : '']">{{ name }}</div>
        </a>
      </div>
    </div>
    <div>
      <app-header :class="$style.appHeader">
        <div slot="left" style="width: 15%;" />
        <input
          :class="$style.searchBar"
          placeholder="Search..."
          spellcheck="false"
          autocomplete="off"
          autocapitalize="none"
          maxlength="30"
          v-model="query"/>
        <header-icon slot="right" :style="{ width: 'initial' }" name="blocks"/>
        <header-icon slot="right" name="more" @click.native="openMenu"/>
        <div slot="right" style="width: 15%;"/>
      </app-header>
      <div :class="$style.container" @click="closeBar">
        <div v-show="resultVisible" :class="$style.content">
          <flexbox-container ref="flexboxContainer" :cards="matchedCards">
            <template scope="props">
              <box :card="props.card" :selection="actionButtonBarVisable"/>
            </template>
          </flexbox-container>
        </div>
        <div v-show="!resultVisible" :class="$style.content">
          <div :class="$style.flex">
            <input
              v-model.lazy.trim="deckName"
              spellcheck="false"
              autocomplete="off"
              autocapitalize="none"
              maxlength="20"
              :class="$style.deckNameInput" />
            <div style="margin-left: auto;">
              <button
                :class="[$style.grey, $style.button]"
                @click="openModal('delete')">
                {{ L('delete')}}
              </button>
            </div>
          </div>
          <deck-subheader />
          <div :class="$style.boxs">
            <box v-for="card in sortedMainDeck" :card="card" :selection="actionButtonBarVisable"/>
          </div>
          <deck-subheader :lrig="true" />
          <div :class="$style.boxs">
            <box v-for="card in sortedLrigDeck" :card="card" :selection="actionButtonBarVisable"/>
          </div>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div v-show="sidebarVisible" :class="$style.sidebar">
        <card-image :class="$style.image" :pid="shownCardPid"/>
        <div style="display: flex;">
          <span>{{ shownCard.wxid }}</span>
          <span style="margin-left: auto;">{{ shownCardLimiting }}</span>
        </div>
        <div style="font-size: 1.5em;">{{ shownCardName }}</div>
        <card-info-table :card="shownCard"/>
      </div>
    </transition>
    <action-button-bar v-show="actionButtonBarVisable" :searching="resultVisible" />
    <header-menu ref="menu" :items="menuItems" :decktopView="true" />
    <deck-modals ref="modals"/>
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
  height: 4rem;
  border-bottom: 1px solid var(--cell-border-color);
}
.title {
  font-size: 1.5rem;
  color: var(--main-color);
}
.mainColor {
  color: #fff;
  background-color: var(--main-color);
}
.grey {
  color: #000;
  background-color: #eee;
}
.button {
  padding: .2em 2em;
  text-transform: capitalize;
  @apply --shadow-4dp;
  transition: .3s;
}
.button:hover {
  @apply --shadow-8dp;
}
.navList {
  color: #757575;
  padding: 1em 0;
}
.navItem {
  padding: .4em 1em;
}
.navItem:hover {
  background-color: rgba(0,0,0,.03);
}
.navItemSelected {
  background-color: rgba(0,0,0,.05);
  color: #212121;
}
.appHeader {
  font-size: .75em;
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
.flex {
  display: flex;
  align-items: center;
  padding: .5rem;
}
.deckNameInput {
  font-size: 1.5em;
  cursor: text;
  display: block;
}
.deckNameInput:hover {
  background-color: rgba(77,144,254,0.15);
}
.boxs {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: .5em 0;
}
.sidebar {
  position: fixed;
  z-index: var(--z-sidebar);
  top: 4rem;
  right: 0;
  width: 20%;
  height: calc(100% - var(--header-height));
  background-color: #fafafa;
  overflow-y: auto;
  box-shadow: -2px 0 4px 0 rgba(0, 0, 0, .15);
  padding: .5em;
}
.image {
  width: 80%;
  display: block;
  margin: 0 auto;
}
</style>
