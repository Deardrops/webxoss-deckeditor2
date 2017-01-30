<script>
import HeaderIcon from './HeaderIcon'
export default {
  components: {
    HeaderIcon,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<template>
  <div :class="$style.wrapper">
    <header>
      <slot name="left">
        <header-icon name="arrow" :class="$style.arrow" @click.native="goBack"/>
      </slot>
      <slot>
        <h1>{{ title }}</h1>
      </slot>
      <slot name="right"></slot>
    </header>
  </div>
</template>

<style module scoped>
@import 'css/vars.css';
.wrapper {
  height: var(--header-height);
}
header {
  position: fixed;
  z-index: var(--z-header);
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 1.2rem;
  height: var(--header-height);
  line-height: var(--header-height);
  background-color: var(--main-color);
  @apply --shadow-4dp;
}
h1 {
  flex: 1;
}
.arrow {
  transform: rotate(180deg);
}
</style>
