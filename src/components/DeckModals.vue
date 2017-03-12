<script>
import { mapGetters, mapState } from 'vuex'
import { parseDeckJson } from 'js/parseDeck'
import Modal from 'components/Modal'
import L from 'js/Localize'

export default {
  components: {
    Modal,
  },
  computed: {
    ...mapState([
      'deckName',
      'tempDeck',
    ]),
    ...mapGetters([
      'deckPids',
      'deckNames',
      'deckFileJson',
    ]),
    shown() {
      return !!this.config.type
    },
    config() {
      return {
        'add': {
          type: 'prompt',
          content: L('input_new_deck_name'),
          validate: name => name && !this.deckNames.includes(name),
          okText: L('add'),
          ok: name => {
            this.$store.commit('putDeckFile', {
              name,
              pids: [],
            })
            this.$store.commit('switchDeck', name)
          },
        },
        'clone': {
          type: 'prompt',
          content: L('input_new_deck_name'),
          validate: name => name && !this.deckNames.includes(name),
          okText: L('clone'),
          ok: name => {
            this.$store.commit('putDeckFile', {
              name,
              pids: this.deckPids.slice(),
            })
            this.$store.commit('switchDeck', name)
          },
        },
        'rename': {
          type: 'prompt',
          content: L('input_new_deck_name'),
          defaultInput: this.deckName,
          validate: name => name && !this.deckNames.includes(name),
          okText: L('rename'),
          ok: name => {
            this.$store.commit('renameDeck', {
              origin: this.deckName,
              name,
            })
          },
        },
        'delete': {
          type: 'confirm',
          content: L('confirm_delete', this.deckName),
          okText: L('delete'),
          ok: () => {
            this.$store.commit('deleteDeck', this.deckName)
          },
          cancelText: L('reserve'),
        },
        'nameDeck': {
          type: 'prompt',
          content: L('input_new_deck_name'),
          defaultInput: this.tempDeck.name,
          validate: name => name && !this.deckNames.includes(name),
          okText: L('add'),
          ok: name => {
            this.$store.commit('putDeckFile', {
              name,
              pids: this.tempDeck.pids,
            })
            this.$store.commit('switchDeck', name)
          },
        },
        'pasteDeck': {
          type: 'prompt',
          content: 'please input deck here',
          validate: json => {
            return json && parseDeckJson(json)
          },
          okText: L('ok'),
          ok: json => {
            let name = ''
            let pids = parseDeckJson(json)
            this.$store.commit('setTempDeck', {name, pids})
            this.open('nameDeck')

            // clearup input box
            this.$refs.modal.setInputValue()
            // avoid closing Modal
            return false
          },
        },
        'showDeck': {
          type: 'prompt',
          content: 'please copy the text below',
          defaultInput: this.deckFileJson,
          okText: L('ok'),
          ok: () => {},
        },
      }[this.$route.query.modal] || {}
    },
  },
  methods: {
    open(type) {
      this.$router.replace({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, {
          sheet: '',
          modal: type,
        }),
      })
    },
    close() {
      this.$router.go(-1)
    },
    ok(input) {
      if (!this.config.ok || this.config.ok(input) !== false) {
        this.close()
      }
    },
  },
  watch: {
    shown(shown) {
      if (shown) {
        this.$refs.modal.setInputValue(this.config.defaultInput)
        this.$nextTick(() => {
          this.$refs.modal.focus()
        })
      }
    },
  },
}
</script>

<template>
  <modal
    ref="modal"
    v-show="shown"
    :config="config"
    @ok="ok"
    @cancel="close"/>
</template>
