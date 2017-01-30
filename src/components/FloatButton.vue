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
  <div :class="$style.float">
    <slot><icon :name="name"/></slot>
  </div>
</template>

<style module>
.float {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
</style>