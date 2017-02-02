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
  data: () => ({
    isProtection: false,
  }),
  methods: {
    plus() {
      this.$emit('plus')
    },
    minus() {
      this.$emit('minus')
    },
  },
  watch: {
    count(newCount) {
      let self = this
      if (newCount === 0) {
        this.isProtection = true
        setTimeout(() => {
          self.isProtection = false
        }, 2000)
      }
    },
  },
}
</script>

<template>
  <div :class="$style.group" @click.prevent>
    <button 
      :class="$style.minus" 
      @click="minus" 
      :disabled="(!isRemaining && count <= 0) || isProtection">
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
