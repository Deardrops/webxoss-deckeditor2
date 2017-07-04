<script>
import { mapState, mapGetters } from 'vuex'
import Block from 'components/Block'
import Searcher from 'js/Searcher.js'
import { defaultSort } from 'js/util'
import CardImage from 'components/CardImage'

export default {
  components: {
    Block,
    CardImage,
  },
  data: () => ({
    queryString: '',
    timer: -1,
    blocking: false,
    request: -1,
  }),
  computed: {
    ...mapState([
      'shownPid',
    ]),
    ...mapGetters([
      'deckPids',
      'mainDeck',
      'lrigDeck',
    ]),
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
          }, 500)
          return
        }

        this.queryString = query
        this.blocking = true
        this.timer = setTimeout(() => {
          this.blocking = false
        }, 500)
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
    },
    addCard(pid) {
      this.$store.dispatch('addCard', pid).then((successed) => {
        if (!successed) {
          console.log('already full') // show toast here
        }
      })
    },
  },
  mounted() {
    this.query = ''
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.detail">
      <card-image :pid="shownPid" :class="$style.image" />
    </div>
    <div :class="$style.blocks">
      <div>
        <block
          v-for="card in sortedMainDeck"
          :class="$style.block"
          :card="card"
          @click="delCard"/>
      </div>
      <div>
        <block
          v-for="card in sortedLrigDeck"
          :class="$style.block"
          :card="card"
          @click="delCard"/>
      </div>
    </div>
    <div :class="$style.searcher">
      <input
        :class="$style.search"
        placeholder="Search..."
        spellcheck="false"
        autocomplete="off"
        autocapitalize="none"
        maxlength="30"
        ref="input"
        v-model="query">
      <section :class="$style.result">
        <block v-for="card in matchedCards.slice(0,20)" :card="card" @click="addCard"/>
      </section>
    </div>
  </div>
</template>

<style module>
@import 'css/vars.css';
.container {
  display: flex;
}
.detail {
  width: 20%;
}
.image {
  display: block;
  margin: 0 auto;
}
.blocks {
  width: 60%;
}
.block {
  width: 10%;
}
.searcher {
  width: 20%;
  height: 100vh;
  overflow: auto;
}
.search {
  position: absolute;
  z-index: 1;
  height: 2em;
  margin: .5em;
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}
.search::placeholder {
  color: #000a;
}
.search::selection {
  color: #333;
}
.result {
  width: 200px;
  padding-top: 3em;
  margin: 0 auto;
}
</style>
