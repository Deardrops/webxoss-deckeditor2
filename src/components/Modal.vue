<script>
import Localize from 'js/Localize'
let L = (text) => {
  return Localize('page', text)
}
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    input: '',
  }),
  computed: {
    okDisabled() {
      return this.config.type === 'prompt' &&
        (this.config.validate && !this.config.validate(this.input))
    },
    cancelShown() {
      return this.config.type !== 'alert'
    },
    okText() {
      return this.config.okText || L('ok')
    },
    cancelText() {
      return this.config.cancelText || L('cancel')
    },
  },
  methods: {
    setInputValue(value) {
      this.input = value || ''
    },
    focus() {
      if (this.$refs.input) {
        this.$refs.input.select()
      } else if (this.$refs.wrapper) {
        this.$refs.wrapper.focus()
      }
    },
    cancel() {
      this.$emit('cancel')
    },
    ok() {
      this.$emit('ok', this.input)
    },
  },
}
</script>

<template>
  <div
    ref="wrapper"
    :class="$style.wrapper"
    tabindex="0"
    @keyup.esc="cancel">
    <form :class="$style.dialog" @submit.prevent="ok">
      <h3 :class="$style.title" v-if="config.title">{{ config.title }}</h3>
      <div :class="$style.content">{{ config.content }}</div>
      <div :class="$style.inputWrapper" v-if="config.type === 'prompt'">
        <input
          :class="$style.input"
          ref="input"
          type="text"
          autofocus
          v-model="input">
      </div>
      <div :class="$style.foot">
        <button
          :class="$style.button"
          v-if="cancelShown"
          type="button"
          @click="cancel">
          {{ cancelText }}
        </button>
        <button
          :class="$style.button"
          type="submit"
          :disabled="okDisabled">
          {{ okText }}
        </button>
      </div>
    </form>
  </div>
</template>

<style module>
@import 'css/vars.css';
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0006;
  z-index: var(--z-modal);
}
.dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 70%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 2px;
  @apply --shadow-24dp;
}
.title,
.content,
.inputWrapper {
  margin: calc(2 * var(--padding));
}
.input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding-left: 1ch;
  border-bottom: 2px solid var(--main-color);
}
.foot {
  text-align: right;
  margin: var(--padding) 0;
}
.button {
  padding: 0 calc(.5 * var(--padding));
  line-height: 2.5;
  margin-right: var(--padding);
  color: var(--main-color);
  font-weight: bold;
  text-transform: uppercase;

  &:disabled {
    color: #999;
  }

  &:focus {
    background-color: #eee;
  }
}
</style>
