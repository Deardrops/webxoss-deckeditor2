<script>
/*
  # About page transition

  1. When going forward, the new page slides left to cover the previous page.
  2. When back, the old page slides right to expose the covered page.

  # About layout

  When transiting, the two pages are in DOM at the same time.
  If both `postion: static;`, one will be under another.

  It's ok to set every page `fixed` to screen and use `transform` to slide.
  But scrolling on body rather than an element performs much better.

  Here, we `fixed` the leaving page and keep the entering one `static`.

  # About scroll postition

  Once navigated, browser will restore scroll position instantly.

  Because the entering page is `static`, it gets a perfectly correct scroll top.

  But the leaving one, which is `fixed` to screen,
  should set `top` to the scroll top before navigating.

  Unfortunately, there is no such a hook.
  So, we set an interval to get scroll top and apply it to the leaving page.
*/
export default {
  data: () => ({
    timer: -1,
    scrollY: 0,
    transition: 'forward',
  }),
  watch: {
    $route(to, from) {
      let paths = this.$router.options.routes.map(route => route.path)
      let delta = paths.indexOf(to.path) - paths.indexOf(from.path)
      if (!delta) {
        this.transition = ''
      } else {
        this.transition = delta > 0 ? 'forward' : 'backward'
      }
    },
  },
  methods: {
    beforeLeave(el) {
      el.style.top = `-${this.scrollY}px`
    },
  },
  created() {
    this.timer = setInterval(() => {
      this.scrollY = window.scrollY
    }, 500)
  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>

<template>
  <div id="app">
    <keep-alive>
      <transition :name="transition" @before-leave="beforeLeave">
        <router-view class="page"></router-view>
      </transition>
    </keep-alive>
  </div>
</template>

<style src="css/common.css"></style>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #fff;
}

/* new page (entering) */
.forward-enter-active {
  transition: transform .6s;
}
.forward-enter {
  transform: translateX(100%);
}
/* old page (staying) */
.forward-leave-active {
  transition: opacity .6s;
  position: fixed;

  /* Android 4.3 doesn't support vw */
  /* iOS 100% includes the transformed element width */
  width: 100%;
  width: 100vw;
}
.forward-leave-to {
  opacity: 0;
}

/* new page (staying) */
.backward-enter-active {
  transition: opacity .6s;
}
.backward-enter {
  opacity: 0;
}
/* old page (leaving) */
.backward-leave-active {
  transition: all .7s;
  position: fixed;
  width: 100%;
  width: 100vw;
}
.backward-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
