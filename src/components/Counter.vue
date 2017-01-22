<!--
  props:
    count
  events:
    plus, minus
-->

<script>
import Icon from 'components/Icon'
export default {
  components: {
    Icon,
  },
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
  methods: {
    plus() {
      this.$emit('plus')
    },
    minus() {
      this.$emit('minus')
    },
  },
}
</script>

<template>
  <div :class="$style.group">
    <button :class="$style.minus" @click="minus">
      <icon name="remove"/>
    </button>
    <button :class="$style.count" disabled>{{ count }}</button>
    <button :class="$style.plus" @click="plus">
      <icon name="add"/>
    </button>
  </div>
</template>

<style module>
.group {
  display: inline-block;
}
</style>
