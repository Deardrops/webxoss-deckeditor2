<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon, HeaderMenu } from 'components/AppHeader'
import DeckModals from 'components/DeckModals'
import ActionButtonBar from 'components/ActionButtonBar'
import BoxContainer from 'components/BoxContainer'
import DeckHead from 'components/DeckHead'
import Sidebar from 'components/Sidebar'
import Tips from 'components/Tips'
import Icon from 'components/Icon'
import Box from 'components/Box'
import Block from 'components/Block'
import { defaultSort } from 'js/util'
import Searcher from 'js/Searcher.js'
import Localize from 'js/Localize'
import _ from 'lodash'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    HeaderMenu,
    DeckModals,
    ActionButtonBar,
    BoxContainer,
    DeckHead,
    Sidebar,
    Tips,
    Icon,
    Box,
    Block,
  },
  data: () => ({
    queryString: '',
    timer: -1,
    blocking: false,

    shownTips: false,
    previewing: false,
  }),
  computed: {
    ...mapState([
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
        return this.$route.query.query || ''
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

        this.updateQueryPart({
          query,
        })
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
    matchedCards() {
      return Searcher.search(this.query)
    },
    shownMainDeck() {
      let deck = _.unionBy(this.mainDeck, 'pid')
      return defaultSort(deck)
    },
    shownLrigDeck() {
      let deck = _.unionBy(this.lrigDeck, 'pid')
      return defaultSort(deck)
    },
  },
  methods: {
    defaultSort,
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
    tooglePreview() {
      this.previewing ? this.previewing = false : this.previewing = true
    },
    toogleTips() {
      this.shownTips ? this.shownTips = false : this.shownTips = true
    },
    scrollToTop() {
      window.scrollTo(0, 0)
      this.shownTips = false
      if (this.$refs.boxContainer) {
        this.$refs.boxContainer.resetRows()
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
        <template v-if="!resultVisible">
          <header-icon slot="right" :style="{ width: 'initial' }" name="blocks" @click.native="tooglePreview" />
          <header-icon slot="right" name="more" @click.native="openMenu"/>
        </template>
        <template v-if="resultVisible">
          <header-icon slot="right" name="bulb" @click.native="toogleTips" />
        </template>
        <div slot="right" style="width: 10%;"/>
      </app-header>
      <div :class="$style.container" @click="closeBar">
        <div v-if="resultVisible" :class="$style.content">
          <box-container
            v-if="matchedCards.length && !shownTips"
            ref="boxContainer"
            :loadMoreEnabled="true"
            :cards="matchedCards" />
          <tips v-if="!matchedCards.length && !shownTips" name="emptyTips" />
          <tips v-if="shownTips" name="searchTips" />
        </div>
        <div v-show="!resultVisible" :class="$style.content">
          <template v-if="!previewing">
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
            <deck-head />
            <box-container :cards="defaultSort(mainDeck)" />
            <deck-head :lrig="true" />
            <box-container :cards="defaultSort(lrigDeck)" />
          </template>
          <template v-if="previewing">
            <div :class="$style.blocks">
              <div>
                <block v-for="card in shownMainDeck" :class="$style.block" :card="card" :showCount="true" />
              </div>
              <div>
                <block v-for="card in shownLrigDeck" :class="$style.block" :card="card" :showCount="true" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <sidebar />
    <action-button-bar :searching="resultVisible" />
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
  font-size: 1.7rem;
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
  padding: 0 10% 0 15%;
  min-height: calc(100vh - var(--header-height));
}
.content {
  margin-left: 2em;
  padding-top: .5em;
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
.blocks {
  padding: var(--padding);
}
.block {
  width: 12%;
  padding: .2em;
}
</style>
