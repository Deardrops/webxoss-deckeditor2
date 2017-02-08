<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon, HeaderMenu } from 'components/AppHeader'
import DeckModals from 'components/DeckModals'
import DeckFloatButton from 'components/DeckFloatButton'
import Cell from 'components/Cell'
import Block from 'components/Block'
import DeckHead from 'components/DeckHead'
import { defaultSort, isLrigCard } from 'js/util'
import _ from 'lodash'

let requestFrame = window.requestIdleCallback || window.requestAnimationFrame
let cancelRequest = window.cancelIdleCallback || window.cancelAnimationFrame

export default {
  components: {
    AppHeader,
    HeaderIcon,
    HeaderMenu,
    DeckModals,
    DeckFloatButton,
    Cell,
    Block,
    DeckHead,
  },
  data: () => ({
    request: -1,
    isScrollToLrig: false,
    isPreviewing: true,
  }),
  computed: {
    ...mapState([
      'remainingPids',
    ]),
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
    ]),
    menuItems() {
      return [
        {
          title: 'New Deck',
          icon: 'add',
          action: () => {},
        },
        {
          title: 'Clone',
          icon: 'copy',
          action: () => {
            this.openModal('clone')
          },
        },
        {
          title: 'Rename',
          icon: 'edit',
          action: () => {
            this.openModal('rename')
          },
        },
        {
          title: 'Delete',
          icon: 'del',
          action: () => {
            this.openModal('delete')
          },
        },
        {
          title: 'Import',
          icon: 'download',
          action: () => {},
        },
        {
          title: 'Export',
          icon: 'upload',
          action: () => {},
        },
      ]
    },
    shownMainDeck() {
      let remainingDeck = this.remainingPids.map(pid => CardInfo[pid])
        .filter(card => !isLrigCard(card))
      let deck = _.unionBy(this.mainDeck, remainingDeck, 'pid')
      return defaultSort(deck)
    },
    shownLrigDeck() {
      let remainingDeck = this.remainingPids.map(pid => CardInfo[pid])
        .filter(card => isLrigCard(card))
      let deck = _.unionBy(this.lrigDeck, remainingDeck, 'pid')
      return defaultSort(deck)
    },
    headHeight() {
      if (this.$refs.appHead && this.$refs.deckHead){
        return this.$refs.appHead.$el.clientHeight +
          this.$refs.deckHead.$el.clientHeight
      }
      return 0
    },
    deckNames() {
      return this.$store.getters.deckNames
    },
    deckName: {
      get() {
        return this.$store.state.deckName
      },
      set(name) {
        this.$store.commit('switchDeck', name)
      },
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
    updateDeckHeader() {
      let lrigDOM = this.$refs.lrigDOM
      if (!lrigDOM) {
        return
      }
      if (lrigDOM.getBoundingClientRect().top < this.headHeight) {
        this.isScrollToLrig = true
      } else {
        this.isScrollToLrig = false
      }
      this.request = requestFrame(this.updateDeckHeader)
    },
  },
  mounted() {
    this.updateDeckHeader()
  },
  destroyed() {
    cancelRequest(this.request)
  },
}
</script>

<template>
  <div>
    <app-header title="Deck Editor" ref="appHead">
      <select :class="$style.select" v-model="deckName">
        <option v-for="name in deckNames" :value="name">{{ name }}</option>
      </select>
      <header-icon slot="right" name="more" @click.native="openMenu"/>
    </app-header>
    <deck-head :isScrollToLrig="isScrollToLrig" ref="deckHead"></deck-head>
    <template v-if="!isPreviewing">
      <ul>
        <li v-for="card in shownMainDeck">
          <cell :card="card" :protectionEnabled="true"/>
        </li>
      </ul>
      <ul ref="lrigDOM">
        <li v-for="card in shownLrigDeck">
          <cell :card="card" :protectionEnabled="true"/>
        </li>
      </ul>
    </template>
    <template v-else>
      <div :class="$style.row">
      <div :class="$style.col" v-for="card in shownMainDeck">
        <block :card="card"/>
      </div>
      </div>
      <div :class="$style.row">
      <div :class="$style.col" v-for="card in shownLrigDeck">
        <block :card="card"/>
      </div>
      </div>
    </template>
    <deck-float-button />
    <header-menu ref="menu" :items="menuItems"/>
    <deck-modals ref="modals"/>
  </div>
</template>

<style module>
.select {
  flex: 1;
  max-width: 70%;
  vertical-align: middle;
  color: #fff;
  & > option {
    color: #000;
  }
}
.row {
  clear: both;
}
.col {
  float: left;
  margin: 1%;
  width: 23%;
}
</style>