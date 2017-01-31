<script>
import { mapGetters, mapState } from 'vuex'
import Modal from 'components/Modal'
export default {
  components: {
    Modal,
  },
  computed: {
    ...mapState([
      'deckName',
    ]),
    ...mapGetters([
      'deckPids',
      'deckNames',
    ]),
    shown() {
      return !!this.config.type
    },
    config() {
      return {
        'add': {
          type: 'prompt',
          content: 'New deck name:',
          okText: 'CREATE',
          ok: name => {
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
        'clone': {
          type: 'prompt',
          content: 'New deck name:',
          okText: 'CLONE',
          ok: name => {
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
        'rename': {
          type: 'prompt',
          content: 'New deck name:',
          defaultInput: this.deckName,
          okText: 'RENAME',
          ok: name => {
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
        'delete': {
          type: 'confirm',
          content: `Are you sure to delete "${this.deckName}" ?`,
          okText: 'DELETE',
          ok: () => {
            this.$store.commit('deleteDeck', this.deckName)
          },
          cancleText: 'RESERVE',
        },
      }[this.$route.query.modal] || {}
    },
  },
  methods: {
    open(type) {
      this.$router.replace({
        path: this.$route.path,
        query: {
          modal: type,
        },
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
    @cancle="close"/>
</template>
