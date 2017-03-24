<script>
export default {
  props: {
    sheetConfigs: {
      type: Array,
      require: true,
    },
  },
  data: () => ({
    configs: [],
  }),
  computed: {
    opened() {
      return !!this.$route.query.sheet
    },
  },
  methods: {
    close() {
      this.$router.go(-1)
    },
    focus() {
      if (this.$refs.wrapper) {
        this.$refs.wrapper.focus()
      }
    },
  },
  watch: {
    opened(opened) {
      document.body.style.overflow = opened ? 'hidden' : 'auto'
      if (opened) {
        this.$nextTick(() => {
          this.focus()
        })
      }
    },
    sheetConfigs(sheetConfigs) {
      if (sheetConfigs.length) {
        this.configs = sheetConfigs
      }
    },
  },
}
</script>

<template>
  <div
    ref="wrapper"
    tabindex="0"
    :class="[$style.wrapper, opened ? $style.opened : '']"
    @touchmove.stop
    @keyup.esc="close"
    @click.self="close">
    <transition name="fade">
      <ul :class="$style.sheet" v-show="opened">
        <li v-for="item in configs" :class="$style.item" @click="item.click">
          {{ item.text }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<style module>
@import 'css/vars.css';
.wrapper.opened {
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
.sheet:global(.fade-enter-active),
.sheet:global(.fade-leave-active) {  
  transition: transform .2s ease-out;
}
.sheet:global(.fade-enter),
.sheet:global(.fade-leave-active) {
  transform: translateY(100%);
}
</style>
