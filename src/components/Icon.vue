<!--
  props:
    name
-->

<script>
import * as Icon from 'js/Icon'
export default {
  props: {
    name: String,
    required: true,
  },
  computed: {
    href() {
      return Icon[this.name]
    },
  },
}
</script>

<template>
  <svg><use :xlink:href="href"/></svg>
</template>

<style scoped>
svg {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
