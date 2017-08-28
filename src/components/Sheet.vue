<script>
import Icon from 'components/Icon'
export default {
  props: {
    sheetConfigs: {
      type: Object,
      require: true,
    },
  },
  components: {
    Icon,
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
      <div :class="$style.sheet" v-show="opened">
        <div :class="$style.head">
          {{ sheetConfigs.head }}
        </div>
        <a
          v-for="option in sheetConfigs.options"
          :class="$style.option"
          @click="option.click">
          <span :class="$style.icon">
            <icon :name="option.icon" />
          </span>
          <span>{{ option.text }}</span>
        </a>
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
  display: flex;
  justify-content: center;
  background-color: #0006;
}
.sheet {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: .5em 1em;
  background-color: #fff;
  @media (width > 1024px) {
    width: 40%;
  }
}
.head {
  font-size: 1.3em;
  padding: .5em 0;
  color: #666;
  &::first-letter {
    text-transform: uppercase;
  }
}
.option {
  display: flex;
  align-items: center;
  padding: .5em 0;
  font-size: 1.5em;
  cursor: pointer;
  text-transform: capitalize;
}
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: .7em;
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
