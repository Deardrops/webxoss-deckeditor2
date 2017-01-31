<script>
import { mapGetters } from 'vuex'
import { AppHeader, HeaderIcon, HeaderMenu } from 'components/AppHeader'
import DeckModals from 'components/DeckModals'
import FloatButton from 'components/FloatButton'
import Cell from 'components/Cell'
import DeckHead from 'components/DeckHead'
import _ from 'lodash'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    HeaderMenu,
    DeckModals,
    FloatButton,
    Cell,
    DeckHead,
  },
  data() {
    return {
      menuItems: [
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
      ],
    }
  },
  computed: {
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
    ]),
  },
  methods: {
    unique: deck => _.uniqBy(deck, 'pid'),
    goSearch() {
      this.$router.push({
        path: '/search',
        query: {
          limit: 20,
        },
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
  },
}
</script>

<template>
  <div>
    <app-header title="Deck Editor">
      <header-icon slot="right" name="more" @click.native="openMenu"/>
    </app-header>
    <deck-head></deck-head>
    <ul>
      <li v-for="card in unique(mainDeck)">
        <cell :card="card"/>
      </li>
    </ul>
    <ul>
      <li v-for="card in unique(lrigDeck)">
        <cell :card="card"/>
      </li>
    </ul>
    <float-button :class="$style.float" name="search" @click.native="goSearch"/>
    <header-menu ref="menu" :items="menuItems"/>
    <deck-modals ref="modals"/>
  </div>
</template>

<style module>
.float {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 4rem;
  height: 4rem;
  font-size: 1.5em;
  color: #fff;
  background-color: #ff5722;
  box-shadow: 0 2px 5px #666;
  transition: background-color .1s;
  &:active {
    background-color: color(#ff5722 whiteness(50%));
  }
}
</style>
