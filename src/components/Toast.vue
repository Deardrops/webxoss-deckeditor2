<script>
export default {
  props: {
    desktopView: {
      require: false,
    },
  },
  data: () => ({
    visable: false,
    text: '',
    timmer: -1,
  }),
  methods: {
    show(text) {
      this.text = text
      if (this.visable) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.visable = false
        }, 2000)
        return
      }
      this.visable = true
      this.timer = setTimeout(() => {
        this.visable = false
      }, 2000)
    },
  },
}
</script>

<template>
  <div>
    <transition name="slide">
      <div :class="$style.wrapper" v-show="visable">
        <div :class="[$style.toast, desktopView ? $style.center : $style.full]" >
          <span :class="$style.text">{{ text }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style module>
@import 'css/vars.css';
.wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-toast);
  display: flex;
  justify-content: center;
}
.toast {
  padding: .75rem 3rem;
  background-color: #323232;
}
.full {
  width: 100%;
}
.center {
  min-width: 30%;
  max-width: 70%;
}
.text {
  color: #eee;
  font-size: 1.5rem;
}
.wrapper:global(.slide-enter-active),
.wrapper:global(.slide-leave-active) {  
  transition: transform .2s ease-out;
}
.wrapper:global(.slide-enter),
.wrapper:global(.slide-leave-active) {
  transform: translateY(100%);
}
</style>
