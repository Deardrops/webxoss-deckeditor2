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
    isRemaining: {
      require: false,
    },
  },
  data: () => ({
    // protecting operation mistakes when click [-] button
    // effect: delay 0.5s while count === 0
    protecting: false, // if true, disable [-] button
    timer: -1,
  }),
  methods: {
    plus() {
      this.$emit('plus')
    },
    minus() {
      if (this.count === 1) {
        this.protecting = true
        this.timer = setTimeout(() => {
          this.protecting = false
        }, 500)
      }
      this.$emit('minus')
    },
  },
  destroyed() {
    clearTimeout(this.timer)
  },
}
</script>

<template>
  <div :class="$style.group" @click.prevent>
    <button 
      :class="$style.minus" 
      @click="minus" 
      :disabled="(!isRemaining && count <= 0) || protecting">
      <icon v-if="isRemaining" :class="$style.cross" name="add"/>
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
.cross {
  transform: rotate(45deg);
  color: #f04228;
}
</style>
