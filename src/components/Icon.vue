<!--
  props:
    name
    label, for accessibility
-->

<script>
import * as Icon from 'js/Icon'
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
  },
  computed: {
    href() {
      return Icon[this.name]
    },
  },
}
</script>

<template>
  <svg :aria-label="label || name"><use :xlink:href="href"/></svg>
</template>

<style scoped>
svg {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;
}
</style>
