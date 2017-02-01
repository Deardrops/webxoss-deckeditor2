<script>
import Icon from 'components/Icon'

let requestFrame = window.requestIdleCallback || window.requestAnimationFrame
let cancelRequest = window.cancelIdleCallback || window.cancelAnimationFrame

export default {
  components: {
    Icon,
  },
  data: () => ({
    request: -1,
    lastScrollTop: 0,
    hidden: false,
    searchRoute: {
      path: '/search',
      query: {
        limit: 20,
      },
    },
  }),
  methods: {
    updateFloatButton() {
      let currentScrollTop = window.scrollY
      let delta = currentScrollTop - this.lastScrollTop
      if (delta >= 10) {
        // Scroll down
        this.hidden = true
      } else if (delta <= -10) {
        // Scroll up
        this.hidden = false
      } else if (document.body.scrollHeight <= window.innerHeight) {
        // Can not scroll
        this.hidden = false
      }
      this.lastScrollTop = currentScrollTop
      this.request = requestFrame(this.updateFloatButton)
    },
  },
  mounted() {
    this.updateFloatButton()
  },
  destroyed() {
    cancelRequest(this.request)
  },
}
</script>

<template>
  <router-link :to="searchRoute">
    <button :class="[$style.button, hidden ? $style.hidden : '']">
      <icon name="search"/>
    </button>
  </router-link>
</template>

<style module>
@import 'css/vars.css';
.button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 4rem;
  height: 4rem;
  font-size: 1.5em;
  color: #fff;
  background-color: #ff5722;
  border-radius: 50%;
  @apply --shadow-6dp;

  will-change: transform;
  transition: transform .3s;
}
.hidden {
  transform: translateY(6.5rem);
}
</style>
