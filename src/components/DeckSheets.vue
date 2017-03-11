<script>
import { mapState, mapGetters } from 'vuex'
import parseDeckFile from 'js/parseDeckFile'
import Sheet from 'components/Sheet'
// import L from 'js/Localize'
export default {
  components: {
    Sheet,
  },
  computed: {
    ...mapState([
      'deckName',
      'deckFiles',
    ]),
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
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
          text: 'From text',
          click: () => {
            this.$emit('openModal', 'inputDeck')
          },
        }],
        'export': [{
          text: 'To file',
          click: () => {
            this.$refs.download.click()
          },
        }, {
          text: 'To text',
          click: () => {
            let name = this.deckName
            let pids = this.deckPids
            this.$store.commit('importDeck', {name, pids})
            this.$emit('openModal', 'showDeck')
          },
        }, {
          text: 'To clipboard',
          click: () => {
            this.copy()
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
        if (!pids) {
          alert('error while parsing deck file.') // TODO: Localize
          return
        }
        this.$store.commit('importDeck', { name, pids })
        this.$emit('openModal', 'inputDeckName')
        // TODO: hide Sheet when open ImportMoal
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
    copy() {
      this.$refs.copyArea.select()
      try {
        let successful = document.execCommand('copy')
        let msg = successful ? 'successful' : 'unsuccessful'
        console.log('Copying text command was ' + msg)
      } catch (e) {
        console.log('Oops, unable to copy')
      }
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
    <textarea
      ref="copyArea"
      :class="$style.text"
      readonly="true">
      {{ deckFileJson }}
    </textarea>
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
.text {
  position: fixed;
  top: 0;
  left: 0;
  width: 2em;
  height: 2em;
  padiding: 0;
  border: none;
  outline: none;
  box-shadow: none;
  background: transparent;
}
</style>
