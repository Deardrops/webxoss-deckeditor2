<script>
import FloatButton from 'components/FloatButton'
export default {
  components: {
    FloatButton,
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
        this.hidden = true
      } else if (delta <= -10) {
        this.hidden = false
      }
      this.lastScrollTop = currentScrollTop
      this.request = window.requestAnimationFrame(this.updateFloatButton)
    },
  },
  mounted() {
    this.updateFloatButton()
  },
  destroyed() {
    window.cancelAnimationFrame(this.request)
  },
}
</script>

<template>
  <router-link :to="searchRoute">
    <float-button
      :class="[$style.button, hidden ? $style.hidden : '']"
      name="search"/>
  </router-link>
</template>

<style module>
.button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 4rem;
  height: 4rem;
  font-size: 1.5em;
  color: #fff;
  background-color: #ff5722;
  box-shadow: 0 2px 5px #666;

  will-change: transform;
  transition: transform .3s;
}
.hidden {
  transform: translateY(6.5rem);
}
</style>
