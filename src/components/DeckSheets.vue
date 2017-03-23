<script>
import { mapState, mapGetters } from 'vuex'
import parseDeckFile from 'js/parseDeck'
import Sheet from 'components/Sheet'

// import L from 'js/Localize'
export default {
  components: {
    Sheet,
  },
  computed: {
    ...mapState([
      'deckName',
    ]),
    ...mapGetters([
      'deckPids',
      'deckFileJson',
    ]),
    deckFileName() {
      return `${this.deckName}.webxoss`
    },
    deckFileHref() {
      return `data:text/plain;base64,${window.btoa(this.deckFileJson)}`
    },
    shown() {
      return this.sheetConfigs.length
    },
    sheetConfigs() {
      return {
        'import': [{
          text: 'From file',
          icon: 'file',
          click: () => {
            this.$refs.input.click()
          },
        }, {
          text: 'From text',
          icon: 'paste',
          click: () => {
            this.$emit('openModal', 'pasteDeck')
          },
        }],
        'export': [{
          text: 'To file',
          icon: 'file',
          click: () => {
            this.$refs.download.click()
          },
        }, {
          text: 'To text',
          icon: 'paste',
          click: () => {
            if (!this.copy()) {
              let name = this.deckName
              let pids = this.deckPids
              this.$store.commit('setTempDeck', {name, pids})
              this.$emit('openModal', 'showDeck')
            }
          },
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

      parseDeckFile(file).then(pids => {
        this.$store.commit('setTempDeck', { name, pids })
        this.$emit('openModal', 'nameDeck')
      }).catch(() => {
        alert('error while parsing deck file.') // TODO: Localize
      })
    },
    open(type) {
      this.$router.replace({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, {
          menu: '',
          modal: '',
          sheet: type,
        }),
      })
    },
    close() {
      this.$router.replace({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, {
          sheet: '',
        }),
      })
    },
    copy() {
      if (document.queryCommandSupported('copy')) {
        this.$refs.copyArea.value = this.deckFileJson
        this.$refs.copyArea.select()
        let successed = document.execCommand('copy')
        if (successed) {
          // TODO: toast successed info here
          return true
        }
      }
      return false
    },
  },
  watch: {
    shown(shown) {
      document.body.style.overflow = shown ? 'hidden' : 'auto'
      if (shown) {
        this.$nextTick(() => {
          this.$refs.sheet.focus()
        })
      }
    },
  },
}
</script>

<template>
  <div>
    <sheet 
      ref="sheet"
      v-show="shown"
      :sheetConfigs="sheetConfigs"
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
    <textarea
      ref="copyArea"
      :class="$style.text"
      readonly="true">
    </textarea>
  </div>
</template>

<style module>
.hidden {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
  zIndex: -1024;
  overflow: hidden;
}
.text {
  position: fixed;
  top: 0;
  left: 0;
  width: 2em;
  height: 2em;
  padding: 0;
  border: none;
  outline: none;
  box-shadow: none;
  background: transparent;
}
</style>
