<script>
export default {
  props: {
    sheetConfigs: {
      type: Array,
      require: true,
    },
  },
  data: () => ({
    leaving: false,
  }),
  computed: {
    opened() {
      return !!this.$route.query.sheet && !this.leaving
    },
  },
  methods: {
    cancel() {
      this.leaving = true
    },
    close() {
      if (this.leaving) {
        this.leaving = false
      }
      this.$router.replace({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, {
          sheet: '',
        }),
      })
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
        this.focus()
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
    @keyup.esc="cancel"
    @click.self="cancel">
    <transition name="fade" @after-leave="close">
      <div :class="$style.sheet" v-show="opened">
        <div v-for="item in sheetConfigs" :class="$style.item">
          <a @click="item.click">{{ item.text }}</a>
        </div>
      </div>
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
  transition: all .7s ease-out;
}
.sheet:global(.fade-enter),
.sheet:global(.fade-leave-active) {
  transform: translateY(100px);
  opacity: 0;
}
</style>
