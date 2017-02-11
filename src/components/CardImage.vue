<script>
import { getUrlByPid } from 'js/ImageManager'
import Localize from 'js/Localize'
export default {
  props: {
    pid: {
      type: Number,
      required: true,
    },
  },
  computed: {
    src() {
      return getUrlByPid(this.pid)
    },
    alt() {
      return Localize.cardName(CardInfo[this.pid])
    },
  },
}
</script>

<template>
  <img :src="src" :alt="alt">
</template>
