<script>
import DeckHead from 'components/DeckHead'
export default {
  components: {
    DeckHead,
  },
  props: {
    scrolledToLrig: {
      require: true,
    },
    shadow: {
      require: true,
    },
  },
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="[$style.head, shadow ? $style.shadow : '']">
      <deck-head :class="$style.subheader" :lrig="scrolledToLrig" />
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
.subheader {
  width: 100%;
  font-size: 1.3em;
  padding: 0 .5rem;
}
</style>
