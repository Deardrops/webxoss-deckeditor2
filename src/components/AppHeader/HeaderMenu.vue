<script>
import Icon from 'components/Icon'
export default {
  components: {
    Icon,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    opened() {
      return !!this.$route.query.menu
    },
  },
  methods: {
    open() {
      this.$router.push({
        path: this.$route.path,
        query: {
          menu: 'true',
        },
      })
    },
    close() {
      this.$router.go(-1)
    },
    toggle() {
      this.opened ? this.close() : this.open()
    },
  },
}
</script>

<template>
  <div :class="[$style.wrapper, opened ? $style.opened : '']" @click.self="close">
    <transition name="pop">
      <ul v-show="opened" :class="$style.menu">
        <li v-for="item in items">
          <icon :class="$style.icon" :name="item.icon"/>
          <label>{{ item.title }}</label>
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
  z-index: var(--z-header-menu);
}
.menu {
  position: fixed;
  top: var(--padding);
  right: var(--padding);
  background-color: #fff;
  @apply --shadow-8dp;

  will-change: transform;
  transform-origin: right top;

  & > li {
    padding: var(--padding);
    padding-right: calc(2 * var(--padding));
    font-size: 1.2rem;
    color: #666;

    & > * {
      vertical-align: middle;
    }
  }
}
.icon {
  margin-right: var(--padding);
  font-size: 1.2em;
}
.menu:global(.pop-enter-active),
.menu:global(.pop-leave-active) {
  transition: transform .2s ease-out;
}
.menu:global(.pop-enter),
.menu:global(.pop-leave-to) {
  transform: scale(0, 0);
}
</style>
