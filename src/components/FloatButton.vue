<!--
  The root element is the button.
  Style it in the parent component.
-->

<script>
import Icon from 'components/Icon'
export default {
  components: {
    Icon,
  },
  props: {
    name: {
      type: String,
      required: false,
    },
  },
}
</script>

<template>
  <button :class="$style.float">
    <slot><icon :name="name"/></slot>
  </button>
</template>

<style module>
.float {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
</style>