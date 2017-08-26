<script>
import { mapState, mapGetters } from 'vuex'
import parseDeckFile from 'js/parseDeck'
import Sheet from 'components/Sheet'
import L from 'js/Localize'

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
      return !!this.sheetConfigs.head
    },
    sheetConfigs() {
      let configs = {
        'import': {
          head: 'import from',
          options: [{
            text: L('file'),
            icon: 'file',
            click: () => {
              this.$refs.input.click()
            },
          }, {
            text: L('text'),
            icon: 'text',
            click: () => {
              this.$emit('openModal', 'pasteDeck')
            },
          }],
        },
        'export': {
          head: 'export to',
          options: [{
            text: L('file'),
            icon: 'file',
            click: () => {
              this.$refs.download.click()
            },
          }, {
            text: L('clipboard'),
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
        },
      }
      // iOS devices do not support import /export file operations
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        configs['import'].options.splice(0, 1)
        configs['export'].options.splice(0, 1)
      }
      return configs[this.$route.query.sheet] || {}
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
        alert(L('parsing_error'))
      })
    },
    open(type) {
      this.$router.replace({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, {
          modal: '',
          sheet: type,
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
}
</script>

<template>
  <div>
    <sheet 
      ref="sheet"
      :sheetConfigs="sheetConfigs"/>
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
  opacity: 0;
}
</style>
