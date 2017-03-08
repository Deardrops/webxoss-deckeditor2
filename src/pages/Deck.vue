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
import { parseDeckFile } from 'js/importDeck'
import _ from 'lodash'
import L from 'js/Localize'

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
    scrolledToTop: true,
  }),
  computed: {
    ...mapState([
      'remainingPids',
      'deckName',
    ]),
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
      'deckNames',
    ]),
    deckFileName() {
      return `${this.deckName}.webxoss`
    },
    deckFileHref() {
      let json = JSON.stringify({
        format: 'WEBXOSS Deck',
        version: '1',
        content: {
          mainDeck: this.mainDeck.map(card => card.pid),
          lrigDeck: this.lrigDeck.map(card => card.pid),
        },
      })
      return `data:application/octet-stream,${encodeURI(json)}`
    },
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
            this.$refs.input.click()
            this.goListView() // 立即收起Menu
          },
        },
        {
          title: L('export'),
          icon: 'upload',
          action: () => {
            this.$refs.download.click()
            this.goListView()
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
    updateDeckHeader() {
      let $lrigDeck = this.$refs.lrigDeck
      let top = $lrigDeck ? $lrigDeck.getBoundingClientRect().top : 0
      this.scrolledToLrig = top <= window.innerHeight / 2
      this.scrolledToTop = window.scrollY <= 0
      this.request = requestFrame(this.updateDeckHeader)
    },
    toggleView() {
      this.previewing ? this.goListView() : this.goBlockView()
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
    importDeck() {
      let files = this.$refs.input.files
      if (!files.length) {
        return
      }
      let file = files[0]
      let name = file.name.replace(/\.webxoss$/, '')
      if (this.deckNames.includes(name)) {
        alert('name alreadly exist.') // TODO: Localize
        return
      }
      parseDeckFile(file, deck => {
        if (!deck) {
          alert('error while parsing deck file.') // TODO: Localize
          return
        }
        let pids = deck.mainDeck.concat(deck.lrigDeck)
        this.$store.commit('putDeckFile', {name, pids})
        this.$store.commit('switchDeck', name)
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
    <deck-head
      :scrolledToLrig="scrolledToLrig"
      :previewing="previewing"
      :shadow="!scrolledToTop">
    </deck-head>

    <!-- List view -->
    <template v-if="!previewing">
      <ul>
        <li v-for="card in shownMainDeck">
          <cell :card="card" :protectionEnabled="true"/>
        </li>
      </ul>
      <ul ref="lrigDeck">
        <li v-for="card in shownLrigDeck">
          <cell :card="card" :protectionEnabled="true"/>
        </li>
      </ul>
    </template>

    <!-- Block view -->
    <div :class="$style.blocks" v-if="previewing">
      <div>
        <block v-for="card in shownMainDeck" :class="$style.block" :card="card"/>
      </div>
      <div>
        <block v-for="card in shownLrigDeck" :class="$style.block" :card="card"/>
      </div>
    </div>

    <deck-float-button />
    <header-menu ref="menu" :items="menuItems"/>
    <deck-modals ref="modals"/>
    <input
      type="file"
      ref="input"
      :class="$style.hidden"
      accept=".webxoss"
      @change="importDeck"/>
    <a
      target="_blank"
      ref="download"
      :class="$style.hidden"
      :download="deckFileName"
      :href="deckFileHref"
      />
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
}
.hidden {
  display: none;
}
</style>
