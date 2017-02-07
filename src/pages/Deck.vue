<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon, HeaderMenu } from 'components/AppHeader'
import DeckModals from 'components/DeckModals'
import DeckFloatButton from 'components/DeckFloatButton'
import Cell from 'components/Cell'
import DeckHead from 'components/DeckHead'
import { defaultSort, isLrigCard } from 'js/util'
import _ from 'lodash'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    HeaderMenu,
    DeckModals,
    DeckFloatButton,
    Cell,
    DeckHead,
  },
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
          action: () => {
            this.openModal('add')
          },
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
    mainDeckCount() {
      return this.mainDeck.length
    },
    lrigDeckCount() {
      return this.lrigDeck.length
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
  },
}
</script>

<template>
  <div>
    <app-header title="Deck Editor">
      <header-icon slot="right" name="more" @click.native="openMenu"/>
    </app-header>
    <deck-head></deck-head>
<!--     <div :class="$style.subHeader">
      <span>Main Deck</span>
      <span :class="$style.right">{{ mainDeckCount }}/40</span>
    </div> -->
    <ul>
      <li v-for="card in shownMainDeck">
        <cell :card="card" :protectionEnabled="true"/>
      </li>
    </ul>
<!--     <div :class="$style.subHeader">
      <span>Lrig Deck</span>
      <span :class="$style.right">{{ lrigDeckCount }}/10</span>
    </div> -->
    <ul>
      <li v-for="card in shownLrigDeck">
        <cell :card="card" :protectionEnabled="true"/>
      </li>
    </ul>
    <deck-float-button />
    <header-menu ref="menu" :items="menuItems"/>
    <deck-modals ref="modals"/>
  </div>
</template>

<style module>
@import 'css/vars.css';
.subHeader {
  position:sticky;
  top: 4rem;
  z-index: 1;
  background-color: #fff;
  border-top: 1px solid #d6d6d6;
  border-bottom: 1px solid #d6d6d6;
  padding: .2em var(--padding);
  color: #929292;
  & > span {
    font-size: 1.1em;
  }
}
.right {
  float: right;
}
</style>