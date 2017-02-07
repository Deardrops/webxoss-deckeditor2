<script>
import Icon from 'components/Icon'
export default {
  components: {
    Icon,
  },
  props: {
    isScrollToLrig: {
      require: false,
    },
  },
  computed: {
    deckNames() {
      return this.$store.getters.deckNames
    },
    deckName: {
      get() {
        return this.$store.state.deckName
      },
      set(name) {
        this.$store.commit('switchDeck', name)
      },
    },
    burstCount() {
      return this.$store.getters.deck
        .map(card => CardInfo[card.cid]) // TODO: utils
        .filter(card => card.burstEffectTexts)
        .length
    },
    burstClass() {
      return this.burstCount === 20 ? '' : this.$style.warn
    },
    mainCount() {
      return this.$store.getters.mainDeck.length
    },
    mainClass() {
      return this.mainCount === 40 ? '' : this.$style.warn
    },
    lrigCount() {
      return this.$store.getters.lrigDeck.length
    },
    lrigClass() {
      return this.lrigCount === 10 ? '' : this.$style.warn
    },
  },
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.head">
      <div>
      <template v-if="!isScrollToLrig">
        <span>Main Deck</span>
        <span :class="$style.right">
          <span :class="mainClass">{{ mainCount }}</span>/40
        </span>
      </template>
      <template v-else>
        <span>Lrig Deck</span>
        <span :class="$style.right">
          <span :class="lrigClass">{{ lrigCount }}</span>/10
        </span>
      </template>
      </div>
      <div :class="$style.right">
        <span :class="[$style.warn, $style.mayu]">Mayu's Room</span>
        <span>
          <span>LB: <span :class="burstClass">{{ burstCount }}</span>/20</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style module>
@import 'css/vars.css';
.wrapper {
  height: calc(0.8 * var(--header-height));
}
.head {
  position: fixed;
  z-index: var(--z-header);
  top: var(--header-height);
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  line-height: calc(0.8 * var(--header-height));
  padding: 0 var(--padding);
  background-color: #fff;
  border-bottom: 1px solid #d6d6d6;
}
.right {
  margin-left: .8em
}
.warn {
  color: #ff0000;
}
.mayu {
  margin-right: .8em;
}
</style>