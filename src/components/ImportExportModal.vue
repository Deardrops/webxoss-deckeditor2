<script>
import { mapState, mapGetters } from 'vuex'
import parseDeckFile from 'js/parseDeckFile'
import Icon from 'components/Icon'
// import L from 'js/Localize'
export default {
  components: {
    Icon,
  },
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
  },
  methods: {
    selectFile() {
      this.$refs.input.click()
    },
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
        this.$store.commit('putDeckFile', {name, pids}) // bug: 自动更新同名卡组
        this.$store.commit('switchDeck', name)
        this.$emit('openModal')
      })
    },
  },
}
</script>

<template>
  <div 
    ref="wrapper"
    :class="$style.wrapper"
    tabindex="0"
    @keyup.esc="cancel">
    <div :class="$style.dialog">
      <div :class="$style.header">
        <h3 :class="$style.title"> Import - Export </h3>
        <span :class="$style.cancel" @click="$emit('cancel')">
          <icon name="add" label="cancel" />
        <span>
      </div>
      <div :class="$style.flex">
        <div :class="$style.left">Import</div>
        <div :class="$style.right">
          <a @click="selectFile()">From file</a>
          <a>From clipboard</a>
        </div>
        <div :class="$style.left">Export</div>
        <div :class="$style.right">
          <a
            target="_blank"
            ref="download"
            :download="deckFileName"
            :href="deckFileHref">
            To file</a>
          <a>To clipboard</a>
        </div>
      </div>
      <div :class="$style.qr">
        <img src="../static/white_hope.png"/>
      </div>
    </div>
    <input
      type="file"
      ref="input"
      :class="$style.hidden"
      accept=".webxoss"
      @change="importDeck"/>
  </div>
</template>

<style module>
@import 'css/vars.css';
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0006;
  z-index: var(--z-modal);
}
.dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 70%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 2px;
  @apply --shadow-24dp;
}
.header {
  display: flex;
  align-items: center;
  margin: calc(1.5 * var(--padding));
}
.title {
  flex: 1;
}
.cancel {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  & {
    transform: rotate(45deg);
    color: #f04228;
  }
}
.flex {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  line-height: 2em;
}
.left {
  width: 40%;
  text-align: center;
}
.right {
  width: 60%;
  & > a {
    display: block;
    cursor: pointer;
    color: #fff;
    background-color: var(--main-color);
    text-align: center;
    margin: .5em;
    @apply --shadow-2dp;
  }
}
.qr {
  padding: 2em;
  text-align: center;
}
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
