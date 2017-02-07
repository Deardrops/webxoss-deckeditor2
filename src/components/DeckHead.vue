<script>
import Icon from 'components/Icon'
export default {
  components: {
    Icon,
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
    mainDeckCount() {
      return this.$store.getters.mainDeck.length
    },
    lrigDeckCount() {
      return this.$store.getters.lrigDeck.length
    },
  },
}
</script>

<template>
  <div :class="$style.sticky">
    <div :class="$style.head">
      <div>
<!--         <select :class="$style.select" v-model="deckName">
          <option v-for="name in deckNames" :value="name">{{ name }}</option>
        </select>
        <icon :class="$style.arrow" name="arrow"/> -->
        <span>Main Deck</span>
        <span :class="$style.right">{{ mainDeckCount }}/40</span>
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
.head {
  display: flex;
  justify-content: space-between;
  line-height: calc(0.8 * var(--header-height));
  padding: 0 var(--padding);
  border-bottom: 1px solid #d6d6d6;
}
.select {
  vertical-align: middle;
  color: var(--main-color);
  font-weight: bold;
}
.arrow {
  transform: rotate(90deg);
  font-size: 1.7em;
  vertical-align: middle;
  color: var(--main-color);
}
.right {
  font-size: .8em;
}
.warn {
  color: #ff0000;
}
.mayu {
  margin-right: .8em;
}
.sticky {
  position:sticky;
  top: 4rem;
  z-index: 1;
  background-color: #fff;
  /*border-bottom: 1px solid #d6d6d6;*/
}
</style>