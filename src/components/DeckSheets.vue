<script>
import { mapState, mapGetters } from 'vuex'
import parseDeckFile from 'js/parseDeckFile'
import Sheet from 'components/Sheet'
// import L from 'js/Localize'
export default {
  components: {
    Sheet,
  },
  data: () => ({
    newDeckName: '',
    newDeckPids: [],
  }),
  computed: {
    ...mapState([
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
      return `data:text/plain;base64,${window.btoa(json)}`
    },
    shown() {
      return this.config.length
    },
    config() {
      return {
        'import': [{
          text: 'From file',
          click: () => {
            this.$refs.input.click()
          },
        }, {
          text: 'From clipboard',
          click: () => {},
        }],
        'export': [{
          text: 'To file',
          click: () => {
            this.$refs.download.click()
          },
        }, {
          text: 'To clipboard',
          click: () => {},
        }],
      }[this.$route.query.sheet] || []
    },
  },
  methods: {
    importDeck() {
      let files = this.$refs.input.files
      if (!files.length) {
        return
      }
      let file = files[0]
      let name = file.name.replace(/\.webxoss$/, '')

      parseDeckFile(file).then(deck => {
        if (!deck) {
          alert('error while parsing deck file.') // TODO: Localize
          return
        }
        let pids = deck.mainDeck.concat(deck.lrigDeck)
        this.$store.commit('importDeck', { name, pids })
        this.$emit('openModal')
      })
    },
    open(type) {
      this.$router.replace({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, {
          sheet: type,
        }),
      })
    },
    close() {
      this.$router.go(-1)
    },
  },
}
</script>

<template>
  <div>
    <sheet 
      v-show="shown"
      :config="config"
      @cancel="close"/>
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
@import 'css/vars.css';
.hidden {
  position: fixed;
  width: 0;
  height: 0;
  overflow: hidden;
  top: 0;
  left: 0;
  zIndex: -1024;
  opacity: 0;
}
</style>
