<script>
import { mapState } from 'vuex'

export default {
  props: {
    searching: {
      require: true,
    },
  },
  computed: {
    ...mapState([
      'selectedPids',
      'deckName',
    ]),
    count() {
      return this.selectedPids.length
    },
  },
  methods: {
    add() {
      for (let pid of this.selectedPids)  {
        // TODO: use dispatch and toast message
        this.$store.commit('addCard', pid)
      }
    },
    remove() {
      for (let pid of this.selectedPids) {
        this.$store.commit('delCard', pid)
      }
      this.$store.commit('clearSelectedPids')
    },
    cancel() {
      this.$store.commit('clearSelectedPids')
    },
  },
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.count"> {{ count }} selected </div>
    <div v-show="searching" :class="$style.deck">
      <span>add to</span>
      <span>{{ deckName }}</span>
    </div>
    <template v-if="!searching">
      <a :class="$style.cancel" @click="cancel">cancel</a>
      <a :class="$style.action" @click="remove">remove</a>
    </template>
    <template v-if="searching">
      <a :class="$style.cancel" @click="cancel">ok</a>
      <a :class="$style.action" @click="add">add</a>
    </template>
  </div>
</template>

<style module>
@import 'css/vars.css';
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: var(--header-height);
  line-height: var(--header-height);
  width: 100%;
  background-color: var(--main-color);
  z-index: var(--z-action-button-bar);
  color: #fff;
  font-size: 1.2em;
}
.count {
  width: 15%;
  padding-left: 2rem;
}
.deck {
  padding-left: .5rem;
}
.cancel {
  margin-left: auto;
  padding-right: 2rem;
}
.action {
  padding-right: 2rem;
}
</style>
