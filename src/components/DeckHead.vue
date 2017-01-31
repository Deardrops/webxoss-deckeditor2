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
  },
}
</script>

<template>
  <div :class="$style.head">
    <div>
      <select :class="$style.select" v-model="deckName">
        <option v-for="name in deckNames" :value="name">{{ name }}</option>
      </select>
      <icon :class="$style.arrow" name="arrow"/>
    </div>
    <div :class="$style.right">
      <span :class="[$style.warnBubble]">Mayu's Room</span>
      <span :class="[$style.confirmBubble]">LRIG卡组</span>
      <span>
        <span>LB: <span :class="burstClass">{{ burstCount }}</span>/20</span>
      </span>
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
.warnBubble {
  margin-right: .8em;
  padding: 0 .2em;
  color: #ffffff;
  background-color: #ff0000;
  border-radius: .3em;
}
.warnBubble:before {
  content: "✘";
}
.confirmBubble {
  margin-right: .8em;
  padding: 0 .2em;
  color: #008000;
}
.confirmBubble:before {
  content: "✔";
}
</style>