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
    <button :class="$style.minus" @click.prevent="minus">
      <icon name="remove"/>
    </button>
    <button :class="$style.count" disabled>{{ count }}</button>
    <button :class="$style.plus" @click.prevent="plus">
      <icon name="add"/>
    </button>
  </div>
</template>

<style module scoped>
.group {
  display: inline-block;
  font-size: 0;
  white-space: nowrap;
}
button {
  font-size: 1rem;
  width: 2rem;
  height: 2rem;
  border: 1px solid #ebebeb;

  &:not(:last-child) {
    border-right: none;
  }
}
</style>
