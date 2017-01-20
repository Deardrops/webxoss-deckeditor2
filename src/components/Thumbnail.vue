<script>
import ImageManager from 'js/ImageManager.js'
export default {
  props: {
    pid: {
      type: Number,
      required: true,
    },
    // thumbnail origin, (x, y) in percent
    origin: {
      type: Object,
      default: () => ({
        x: .5,
        y: .3,
      }),
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    src() {
      return ImageManager.getUrlByPid(this.pid)
    },
    style() {
      let x = this.origin.x * 100
      let y = this.origin.y * 100
      let scale = this.scale
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-${x}%, -${y}%) scale(${scale}, ${scale})`,
      }
    },
  },
}
</script>

<template>
  <div :class="$style.frame">
    <img :src="src" :style="style">
  </div>
</template>

<style module>
.frame {
  position: relative;
  overflow: hidden;
}
</style>
