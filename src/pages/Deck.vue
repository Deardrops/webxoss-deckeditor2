<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon, HeaderMenu } from 'components/AppHeader'
import DeckModals from 'components/DeckModals'
import DeckFloatButton from 'components/DeckFloatButton'
import CellContainer from 'components/CellContainer'
import Block from 'components/Block'
import DeckHead from 'components/DeckHead'
import Icon from 'components/Icon'
import { defaultSort, isLrigCard } from 'js/util'
import { parseDeckFile } from 'js/importDeck'
import _ from 'lodash'
import L from 'js/Localize'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    HeaderMenu,
    DeckModals,
    DeckFloatButton,
    CellContainer,
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
    ]),
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
      'deckNames',
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
            this.$refs.input.click()
            // alert('Not yet implemented.')
          },
        },
        {
          title: L('export'),
          icon: 'upload',
          action: () => {
            alert('Not yet implemented.')
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
      let lrigDeck = this.$refs.lrigDeck
      if (!lrigDeck) {
        return
      }
      let $lrigDeck = lrigDeck.$el
      let top = $lrigDeck ? $lrigDeck.getBoundingClientRect().top : 0
      this.scrolledToLrig = top <= window.innerHeight / 2
      this.scrolledToTop = window.scrollY <= 0
      this.request = requestIdleCallback(this.updateDeckHeader)
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
      this.goListView() // 立即收起Menu
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
    <deck-head
      :scrolledToLrig="scrolledToLrig"
      :previewing="previewing"
      :shadow="!scrolledToTop">
    </deck-head>

    <!-- List view -->
    <template v-if="!previewing">
      <cell-container :cards="shownMainDeck" :protectionEnabled="true"/>
      <cell-container ref="lrigDeck" :cards="shownLrigDeck" :protectionEnabled="true"/>
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
      style="display:none"
      accept=".webxoss" 
      @change="importDeck"/>
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
</style>
