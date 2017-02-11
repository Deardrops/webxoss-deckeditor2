<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon, HeaderMenu } from 'components/AppHeader'
import DeckModals from 'components/DeckModals'
import DeckFloatButton from 'components/DeckFloatButton'
import Cell from 'components/Cell'
import Block from 'components/Block'
import DeckHead from 'components/DeckHead'
import Icon from 'components/Icon'
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
    Icon,
  },
  data: () => ({
    request: -1,
    scrolledToLrig: false,
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
    updateDeckHeader() {
      let lrigDOM = this.$refs.lrigDOM
      if (!lrigDOM) {
        return
      }
      if (lrigDOM.getBoundingClientRect().top < this.headHeight) {
        this.scrolledToLrig = true
      } else {
        this.scrolledToLrig = false
      }
      this.request = requestFrame(this.updateDeckHeader)
    },
    switchView(mode) {
      (mode === 'preview') ? this.goBlockView() : this.goListView()
    },
    goListView() {
      this.$router.push({
        path: '/deck',
        // query: {
        //   mode: 'list',
        // },
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
    <deck-head
      :scrolledToLrig="scrolledToLrig"
      :previewing="previewing"
      @switchView="switchView"
      ref="deckHead">
    </deck-head>
    <template v-if="!previewing">
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
    <template v-if="previewing">
      <div :class="$style.container">
        <div
          :class="$style.child"
          v-for="card in shownMainDeck">
          <block :card="card"/>
        </div>
        </div>
      <div :class="$style.container">
        <div 
          :class="$style.child" 
          v-for="card in shownLrigDeck">
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
  vertical-align: middle;
  color: #fff;
  & > option {
    color: #000;
  }
}
.container {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}
.child {
  width: 19%;
  padding-top: .2em;
}
</style>