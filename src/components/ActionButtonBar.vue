<script>
import { mapState } from 'vuex'
import Icon from 'components/Icon'
import Localize from 'js/Localize'

export default {
  components: {
    Icon,
  },
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
    visable() {
      return !!this.selectedPids.length
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
    L(text) {
      return Localize(text)
    },
  },
}
</script>

<template>
  <transition name="slide">
    <div v-show="visable" :class="$style.wrapper">
      <div :class="$style.count"> {{ count }} selected </div>
      <div v-show="searching" :class="$style.deck">
        <span>add to deck</span>
        <span :class="$style.name">{{ deckName }}</span>
      </div>
      <template v-if="!searching">
        <a :class="$style.cancel" @click="cancel">{{ L('cancel') }}</a>
        <a :class="$style.action" @click="remove">{{ L('delete') }}</a>
      </template>
      <template v-if="searching">
        <a :class="$style.cancel" @click="cancel">{{ L('ok') }}</a>
        <a :class="$style.action" @click="add">{{ L('add') }}</a>
      </template>
    </div>
  </transition>
</template>

<style module>
@import 'css/vars.css';
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: var(--header-height);
  width: 100%;
  display: flex;
  align-items: center;
  line-height: var(--header-height);
  background-color: var(--main-color);
  z-index: var(--z-action-button-bar);
  font-size: 1.2em;
  color: #fff;
  text-transform: capitalize;
}
.count {
  width: 15%;
  padding-left: 2rem;
}
.deck {
  padding-left: .5rem;
}
.name {
  padding-left: 2rem;
}
.cancel {
  margin-left: auto;
}
.cancel,
.action {
  cursor: pointer;
  padding: 0 1rem;
}
.cancel:hover,
.action:hover {
  background-color: rgba(0,0,0,.27);
}
.wrapper:global(.slide-enter-active) {
  animation: slide-in .5s;
}
.wrapper:global(.slide-leave-active) {
  animation: slide-in .5s reverse;
}
@keyframes slide-in {
  from {
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
</style>
