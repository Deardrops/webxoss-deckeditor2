<script>
import { mapGetters, mapState } from 'vuex'
import { AppHeader, HeaderIcon, HeaderMenu } from 'components/AppHeader'
import Modal from 'components/Modal'
import FloatButton from 'components/FloatButton'
import Cell from 'components/Cell'
import DeckHead from 'components/DeckHead'
import _ from 'lodash'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    HeaderMenu,
    Modal,
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
            this.closeMenu()
            this.$refs.modal.open({
              type: 'prompt',
              content: 'New deck name:',
              ok: {
                text: 'CREATE',
                action: name => {
                  if (this.deckNames.includes(name)) {
                    console.log(`"${name}" already exists.`)
                    return false
                  }
                  this.$store.commit('putDeckFile', {
                    name,
                    pids: [],
                  })
                  this.$store.commit('switchDeck', name)
                },
              },
              cancle: {
                text: 'CANCLE',
              },
            })
          },
        },
        {
          title: 'Clone',
          icon: 'copy',
          action: () => {
            this.closeMenu()
            this.$refs.modal.open({
              type: 'prompt',
              content: 'New deck name:',
              ok: {
                text: 'CLONE',
                action: name => {
                  if (this.deckNames.includes(name)) {
                    console.log(`"${name}" already exists.`)
                    return false
                  }
                  this.$store.commit('putDeckFile', {
                    name,
                    pids: this.deckPids.slice(),
                  })
                  this.$store.commit('switchDeck', name)
                },
              },
              cancle: {
                text: 'CANCLE',
              },
            })
          },
        },
        {
          title: 'Rename',
          icon: 'edit',
          action: () => {
            this.closeMenu()
            this.$refs.modal.open({
              type: 'prompt',
              content: 'New deck name:',
              defaultInput: this.deckName,
              ok: {
                text: 'RENAME',
                action: name => {
                  if (this.deckNames.includes(name)) {
                    console.log(`"${name}" already exists.`)
                    return false
                  }
                  this.$store.commit('renameDeck', {
                    origin: this.deckName,
                    name,
                  })
                },
              },
              cancle: {
                text: 'CANCLE',
              },
            })
          },
        },
        {
          title: 'Delete',
          icon: 'del',
          action: () => {
            this.closeMenu()
            this.$refs.modal.open({
              type: 'confirm',
              content: `Are you sure to delete "${this.deckName}" ?`,
              ok: {
                text: 'DELETE',
                action: () => {
                  this.$store.commit('deleteDeck', this.deckName)
                },
              },
              cancle: {
                text: 'RESERVE',
              },
            })
          },
        },
        {
          title: 'Import',
          icon: 'download',
          action: () => {
            this.closeMenu()
            this.$refs.modal.open({
              type: 'alert',
              content: '喵喵?',
              ok: {
                text: '🐱',
              },
            })
          },
        },
        {
          title: 'Export',
          icon: 'upload',
          action: () => {
            this.closeMenu()
            this.$refs.modal.open({
              type: 'alert',
              content: '喵喵?',
              ok: {
                text: '🐱',
              },
            })
          },
        },
      ],
    }
  },
  computed: {
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
      'deckPids',
      'deckNames',
    ]),
    ...mapState([
      'deckName',
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
    <modal ref="modal"/>
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
