<script>
import { mapState, mapGetters } from 'vuex'
import { AppHeader, HeaderIcon } from 'components/AppHeader'
import CardInfo from 'components/CardInfo'
import CardImage from 'components/CardImage'
import DeckHead from 'components/DeckHead'
import ListContainer from 'components/ListContainer'
import Block from 'components/Block'
import DeckModals from 'components/DeckModals'
import DeckSheets from 'components/DeckSheets'
import Icon from 'components/Icon'
import Searcher from 'js/Searcher.js'
import { defaultSort } from 'js/util'
import Localize from 'js/Localize'

export default {
  components: {
    AppHeader,
    HeaderIcon,
    CardInfo,
    CardImage,
    DeckHead,
    ListContainer,
    Block,
    DeckModals,
    DeckSheets,
    Icon,
  },
  data: () => ({
    queryString: '',
    timer: -1,
    blocking: false,
    mouseInResultZone: false,
    scrollEvent: {},
  }),
  computed: {
    ...mapState([
      'undoPid',
    ]),
    ...mapGetters([
      'deckPids',
      'mainDeck',
      'lrigDeck',
      'deckNames',
    ]),
    actionItems() {
      return [
        {
          icon: 'add',
          action: () => {
            this.openModal('add')
          },
        },
        {
          icon: 'copy',
          action: () => {
            this.openModal('clone')
          },
        },
        {
          icon: 'edit',
          action: () => {
            this.openModal('rename')
          },
        },
        {
          icon: 'del',
          action: () => {
            this.openModal('delete')
          },
        },
        {
          icon: 'download',
          action: () => {
            this.openSteet('export')
          },
        },
        {
          icon: 'upload',
          action: () => {
            this.openSteet('import')
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
    deckName: {
      get() {
        return this.$store.state.deckName
      },
      set(name) {
        this.$store.commit('switchDeck', name)
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
  },
  methods: {
    delCard(pid) {
      this.$store.commit('delCard', pid)
      this.$store.commit('setUndoPid', pid)
    },
    addCard(pid) {
      this.$store.dispatch('addCard', pid).then((successed) => {
        if (!successed) {
          this.$root.showToast(Localize('deck_limit_exceeded'))
        }
      })
      this.$store.commit('setUndoPid', 0)
    },
    undoAction() {
      if (this.undoPid) {
        this.$store.commit('addCard', this.undoPid)
        this.$store.commit('setUndoPid', 0)
      }
    },
    scrollToTop() {
      if (this.$refs.scrollDiv) {
        this.$refs.scrollDiv.scrollTop = 0
      }
    },
    openModal(type) {
      this.$refs.modals.open(type)
    },
    openSteet(type) {
      this.$refs.sheet.open(type)
    },
  },
  created() {
    this.scrollEvent = window.addEventListener('wheel', (event) => {
      if (!this.mouseInResultZone) {
        if (this.$refs.info) {
          this.$refs.info.scrollTop += event.deltaY
        }
      }
    })
  },
  mounted() {
    this.$nextTick(() => {
      let resultZone = this.$refs.result
      if (resultZone) {
        resultZone.addEventListener('mouseenter', () => {
          this.mouseInResultZone = true
        })
        resultZone.addEventListener('mouseleave', () => {
          this.mouseInResultZone = false
        })
      }
    })
  },
  destoryed() {
    window.removeEventListener(this.scrollEvent)
  },
}
</script>

<template>
  <div>
    <app-header :class="$style.appHeader">
      <div :class="$style.title">WEBXOSS</div>
      <select :class="$style.select" v-model="deckName">
        <option v-for="name in deckNames" :value="name">{{ name }}</option>
      </select>
      <header-icon v-show="undoPid" slot="right" name="undo" @click.native="undoAction" />
      <header-icon
        v-for="item in actionItems"
        slot="right"
        :name="item.icon"
        @click.native="item.action" />
    </app-header>
    <div :class="$style.container">
      <div :class="$style.infoZone" ref="info">
        <card-info />
      </div>
      <div :class="$style.deckZone">
        <deck-head />
        <div :class="$style.blocks">
          <block
            v-for="card in sortedMainDeck"
            :class="$style.deckBlock"
            :card="card"
            @click="delCard"/>
        </div>
        <deck-head :lrig="true" />
        <div :class="$style.blocks">
          <block
            v-for="card in sortedLrigDeck"
            :class="$style.deckBlock"
            :card="card"
            @click="delCard"/>
        </div>
      </div>
      <div :class="$style.searchZone">
        <input
          :class="$style.searchBar"
          placeholder="Search..."
          spellcheck="false"
          autocomplete="off"
          autocapitalize="none"
          maxlength="30"
          v-model="query"/>
        <div :class="$style.result" ref="result">
          <list-container
            :cards="matchedCards"
            :longListOpimizationEnabled="true"
            :desktopView="true">
            <template scope="props">
              <block
                :class="$style.searchBlock"
                :card="props.card"
                @click="addCard" />
            </template>
          </list-container>
        </div>
      </div>
    </div>
    <deck-modals ref="modals"/>
    <deck-sheets ref="sheet" @openModal="openModal"/>
  </div>
</template>

<style module>
@import 'css/vars.css';
:root {
  --card-width: 3.5rem;
}
.appHeader>header {
  padding: 0 calc(0.5 * (100% - calc(17 * var(--card-width) + 2rem)));
}
.title {
  width: 11rem;
}
.select {
  flex: 1;
  vertical-align: middle;
  color: #fff;
  & > option {
    color: #000;
  }
}
.container {
  height: calc(100vh - var(--header-height));
  display: flex;
  justify-content: center;
  background-color: #fafafa;
  @apply --shadow-8dp;
}
.infoZone {
  width: calc(4 * var(--card-width));
  max-height: 100%;
  overflow-y: auto;
  padding: .5rem;
}
.deckZone {
  max-height: 100%;
  overflow-y: auto;
  padding-top: .5rem;
}
.blocks {
  width: calc(10 * var(--card-width));
}
.header {
  min-height: 3rem;
}
.deckName {
  font-size: 2rem;
}
.searchZone {
  max-height: 100%;
  width: calc(3 * var(--card-width));
  padding: 0 .5rem;
}
.deckBlock {
  width: var(--card-width);
}
.searchBar {
  display: block;
  height: 2rem;
  width: calc(100% - 1rem);
  margin: .5em;
  color: #000;
  box-sizing: border-box;
  padding-left: 1em;
  text-overflow: clip;
  background-color: #eee;
}
.searchBar::placeholder {
  color: #666;
}
.searchBar::selection {
  color: #000;
  background-color: #2196f3;
}
.result {
  max-height: calc(100vh - 3rem - 4rem);
  overflow-y: auto;
}
.searchBlock {
  width: 80%;
}
</style>
