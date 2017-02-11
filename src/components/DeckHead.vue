<script>
import Icon from 'components/Icon'
export default {
  components: {
    Icon,
  },
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
  },
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="[$style.head, shadow ? $style.shadow : '']">
      <icon
        :class="$style.icon"
        v-if="previewing"
        name="list"
        label="list view"
        @click.native="$emit('switchView', 'list')"/>
      <icon
        :class="$style.icon"
        v-if="!previewing"
        name="blocks"
        label="preview"
        @click.native="$emit('switchView', 'preview')"/>

      <template v-if="previewing">
        <span>Overview</span>
      </template>

      <template v-if="!previewing && !scrolledToLrig">
        <span :class="$style.deckName">MainDeck </span>
        (<span :class="mainClass">{{ mainCount }}</span>/40)
      </template>

      <template v-if="!previewing && scrolledToLrig">
        <span :class="$style.deckName">LrigDeck </span>
        ({{ lrigCount }}/10)
      </template>

      <div :class="$style.right">
        <span :class="[$style.warn, $style.mayu]">Mayu's Room</span>
        <span>LB: <span :class="burstClass">{{ burstCount }}</span>/20</span>
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
  border-bottom: 1px solid #d6d6d6;
}
.shadow {
  @apply --shadow-2dp;
}
.right {
  flex: 1;
  text-align: right;
}
.warn {
  color: #ff0000;
}
.mayu {
  margin-right: .5em;
}
.icon {
  font-size: 1.8em;
}
</style>