<script>
import Icon from 'components/Icon'

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
      this.request = requestIdleCallback(this.updateFloatButton)
    },
  },
  mounted() {
    this.updateFloatButton()
  },
  destroyed() {
    cancelIdleCallback(this.request)
  },
}
</script>

<template>
  <router-link :to="searchRoute">
    <span role="button" :class="[$style.button, hidden ? $style.hidden : '']">
      <icon name="search"/>
    </span>
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

  display: flex;
  justify-content: center;
  align-items: center;

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
