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
    // 删除到0张卡时会禁用Button一会儿 (0.5s)
    // 防止快速操作时误删卡片
    protecting: false,
    timer: -1,
  }),
  methods: {
    plus() {
      this.$emit('plus')
    },
    minus() {
      this.$emit('minus')
    },
  },
  destroyed() {
    clearTimeout(this.timer)
  },
  watch: {
    isRemaining(isRemaining) {
      if (isRemaining) {
        this.protecting = true
        this.timer = setTimeout(() => {
          this.protecting = false
        }, 500)
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
      :disabled="(!isRemaining && count <= 0) || protecting">
      <icon v-if="isRemaining" :class="$style.cross" name="add" label="delete"/>
      <icon v-else name="remove" label="minus"/>
    </button>
    <button :class="$style.count">{{ count }}</button>
    <button :class="$style.plus" @click="plus" :disabled="count >= 4">
      <icon name="add" label="plus"/>
    </button>
  </div>
</template>

<style module scoped>
@import 'css/vars.css';
.group {
  display: inline-block;
  font-size: 0;
  white-space: nowrap;
}
button {
  font-size: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--cell-border-color);

  color: #333;
  &:disabled {
    color: var(--cell-border-color);
  }

  &:not(:last-child) {
    border-right: none;
  }
}
.cross {
  transform: rotate(45deg);
  color: #f04228;
}
</style>
