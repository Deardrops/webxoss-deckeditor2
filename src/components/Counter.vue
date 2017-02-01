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
    isRemaining: Boolean,
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
  <div :class="$style.group" @click.prevent>
    <!-- <button :class="$style.minus" @click="minus" :disabled="count <= 0"> -->
    <button :class="$style.minus" @click="minus" >
      <icon v-if="isRemaining" :class="$style.fork" name="add"/>
      <icon v-else name="remove"/>
    </button>
    <button :class="$style.count" disabled>{{ count }}</button>
    <button :class="$style.plus" @click="plus" :disabled="count >= 4">
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
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #ebebeb;

  &:not(:last-child) {
    border-right: none;
  }
}
.fork {
  transform: rotate(45deg);
  color: #f04228;
}
</style>
