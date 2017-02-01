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
    href: {
      type: String,
      required: false,
    },
  },
}
</script>

<template>
  <a :class="$style.float" :href="href || 'javascript:;'">
    <slot><icon :name="name"/></slot>
  </a>
</template>

<style module>
.float {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
</style>