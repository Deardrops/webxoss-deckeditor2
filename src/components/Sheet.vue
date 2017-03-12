<script>
export default {
  props: {
    sheetConfigs: {
      type: Array,
      require: true,
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    focus() {
      if (this.$refs.wrapper) {
        this.$refs.wrapper.focus()
      }
    },
  },
}
</script>

<template>
  <div
    ref="wrapper"
    :class="$style.wrapper"
    @touchmove.stop
    @keyup.esc="cancel"
    @click.self="cancel">
    <div :class="$style.sheet">
      <div v-for="item in sheetConfigs" :class="$style.item">
        <a @click="item.click">{{ item.text }}</a>
      </div>
    </div>
</template>

<style module>
@import 'css/vars.css';
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0006;
  z-index: var(--z-sheet);
}
.sheet {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: .5em;
  background-color: #fff;
}
.item {
  padding: .5em 1em;
  font-size: 1.5em;
  cursor: pointer;
}
</style>
