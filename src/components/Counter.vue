<script>
export default {
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
    <button :class="$style.minus" @click="minus">-</button>
    <button :class="$style.count" disabled>{{ count }}</button>
    <button :class="$style.plus" @click="plus">+</button>
  </div>
</template>

<style module>
.group {
  display: inline-block;
}
</style>
