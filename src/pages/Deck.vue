<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon, HeaderMenu } from 'components/AppHeader'
import DeckModals from 'components/DeckModals'
import DeckSheets from 'components/DeckSheets'
import DeckFloatButton from 'components/DeckFloatButton'
import ListContainer from 'components/ListContainer'
import Cell from 'components/Cell'
import Block from 'components/Block'
import DeckSubheader from 'components/DeckSubheader'
import Icon from 'components/Icon'
import { defaultSort, isLrigCard } from 'js/util'
import _ from 'lodash'
import L from 'js/Localize'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    HeaderMenu,
    DeckModals,
    DeckSheets,
    DeckFloatButton,
    ListContainer,
    Cell,
    Block,
    DeckSubheader,
    Icon,
  },
  data: () => ({
    request: -1,
    scrolledToLrig: false,
    scrolledToTop: true,
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
          title: L('new_deck'),
          icon: 'add',
          action: () => {
            this.openModal('add')
          },
        },
        {
          title: L('clone'),
          icon: 'copy',
          action: () => {
            this.openModal('clone')
          },
        },
        {
          title: L('rename'),
          icon: 'edit',
          action: () => {
            this.openModal('rename')
          },
        },
        {
          title: L('delete'),
          icon: 'del',
          action: () => {
            this.openModal('delete')
          },
        },
        {
          title: L('import'),
          icon: 'download',
          action: () => {
            this.openSheet('import')
          },
        },
        {
          title: L('export'),
          icon: 'upload',
          action: () => {
            this.openSheet('export')
          },
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
    previewing() {
      return this.$route.query.mode === 'preview'
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
    openSheet(type) {
      this.$refs.sheets.open(type)
    },
    updateDeckHead() {
      let lrigDeck = this.$refs.lrigDeck
      if (!lrigDeck) {
        return
      }
      let $lrigDeck = lrigDeck.$el
      let top = $lrigDeck ? $lrigDeck.getBoundingClientRect().top : 0
      this.scrolledToLrig = top <= window.innerHeight / 2
      this.scrolledToTop = window.scrollY <= 0
      this.request = requestIdleCallback(this.updateDeckHead)
    },
    toggleView() {
      this.previewing ? this.goListView() : this.goBlockView()
    },
    goListView() {
      this.$router.push({
        path: '/deck',
      })
    },
    goBlockView() {
      this.$router.push({
        path: '/deck',
        query: {
          mode: 'preview',
        },
      })
    },
    goDetail(pid) {
      this.$router.push({
        path: '/detail',
        query: {
          pid,
        },
      })
    },
  },
  mounted() {
    this.updateDeckHead()
  },
  destroyed() {
    cancelIdleCallback(this.request)
  },
}
</script>

<template>
  <div>
    <app-header title="Deck Editor">
      <select :class="$style.select" v-model="deckName">
        <option v-for="name in deckNames" :value="name">{{ name }}</option>
      </select>
      <header-icon
        slot="right"
        :style="{ width: 'initial' }"
        :name="previewing ? 'list' : 'blocks'"
        @click.native="toggleView"/>
      <header-icon slot="right" name="more" @click.native="openMenu"/>
    </app-header>
    <deck-subheader
      v-show="!previewing"
      :scrolledToLrig="scrolledToLrig"
      :shadow="!scrolledToTop">
    </deck-subheader>

    <!-- List view -->
    <template v-if="!previewing">
      <list-container :cards="shownMainDeck">
        <template scope="props">
          <cell :card="props.card" :protectionEnabled="true"></cell>
        </template>
      </list-container>
      <list-container ref="lrigDeck" :cards="shownLrigDeck">
        <template scope="props">
          <cell :card="props.card" :protectionEnabled="true"></cell>
        </template>
      </list-container>
    </template>

    <!-- Block view -->
    <div :class="$style.blocks" v-if="previewing">
      <div>
        <block v-for="card in shownMainDeck" :class="$style.block" :card="card" :showCount="true" @click="goDetail"/>
      </div>
      <div>
        <block v-for="card in shownLrigDeck" :class="$style.block" :card="card" :showCount="true" @click="goDetail"/>
      </div>
    </div>

    <deck-float-button />
    <header-menu ref="menu" :items="menuItems"/>
    <deck-modals ref="modals"/>
    <deck-sheets ref="sheets" @openModal="openModal"/>
  </div>
</template>

<style module>
@import "css/vars.css";
.select {
  flex: 1;
  vertical-align: middle;
  color: #fff;
  & > option {
    color: #000;
  }
}
.blocks {
  padding: var(--padding);
}
.block {
  width: 20%;
  padding: .2em;
}
</style>
