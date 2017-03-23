<script>
import Icon from 'components/Icon'

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
  components: {
    Icon,
  },
  methods: {
    cancel() {
      this.leaving = true
    },
    close() {
      this.leaving = false
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
        this.$nextTick(() => {
          this.focus()
        })
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
    <div :class="$style.sheet">
      <a
        v-for="item in sheetConfigs"
        :class="$style.item"
        @click="item.click">
        <span :class="$style.icon">
          <icon :name="item.icon" />
        </span>
        <span>{{ item.text }}</span>
      </a>
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
  display: flex;
  align-items: center;
  padding: .5em 1em;
  font-size: 1.5em;
  cursor: pointer;
}
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: .7em;
}
</style>
