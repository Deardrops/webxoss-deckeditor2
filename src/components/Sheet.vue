<script>
export default {
  props: {
    config: {
      type: Array,
      require: true,
    },
  },
  computed: {

  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<template>
  <div
    ref="wrapper"
    :class="$style.wrapper"
    tabindex="0"
    @touchmove.stop
    @keyup.esc="cancel"
    @click.self="cancel">
    <div :class="$style.modal">
      <div v-for="item in config" :class="$style.item">
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
.modal {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
}
.item {
  padding: .5em 1em;
  font-size: 1.5em;
  cursor: pointer;
}
</style>
