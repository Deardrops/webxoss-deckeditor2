<script>
import Localize from 'js/Localize'
export default {
  props: {
    scrolledToLrig: {
      require: true,
    },
    previewing: {
      require: true,
    },
    shadow: {
      require: true,
    },
  },
  computed: {
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
      return this.lrigCount <= 10 ? '' : this.$style.warn
    },
  },
  methods: {
    L(text) {
      return Localize(text)
    },
  },
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="[$style.head, shadow ? $style.shadow : '']">
      <template v-if="previewing">
        <span>Overview</span>
      </template>

      <template v-if="!previewing && !scrolledToLrig">
        <span :class="$style.deckName">{{ L('main_deck')}} </span>
        (<span :class="mainClass">{{ mainCount }}</span>/40)
      </template>

      <template v-if="!previewing && scrolledToLrig">
        <span :class="$style.deckName">{{ L('lrig_deck') }} </span>
        (<span :class="lrigClass">{{ lrigCount }}</span>/10)
      </template>

      <div :class="$style.right">
        <span :class="[$style.warn, $style.mayu]">{{ L('mayu_room') }}</span>
        <span>{{ L('life_burst_short') }}: <span :class="burstClass">{{ burstCount }}</span>/20</span>
      </div>
    </div>
  </div>
</template>

<style module>
@import 'css/vars.css';
:root {
  --height: calc(0.8 * var(--header-height));
}
.wrapper {
  height: var(--height)
}
.head {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  z-index: var(--z-header);

  display: flex;
  align-items: center;

  padding: 0 var(--padding);
  height: var(--height);

  background-color: #fff;
  border-bottom: 1px solid var(--cell-border-color);

  &.shadow {
    @apply --shadow-2dp;
    border-bottom: transparent;
  }
}
.right {
  flex: 1;
  text-align: right;
}
.warn {
  color: #ff5722;
}
.mayu {
  margin-right: .5em;
}
</style>
