<!--
  props:
    pid, origin, scale

  Should set css width and height for this component.
-->

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
    // iamgeWidth / containerWidth
    scale: {
      type: Number,
      default: 2.5,
    },
  },
  computed: {
    src() {
      return ImageManager.getUrlByPid(this.pid)
    },
    style() {
      let x = this.origin.x * 100
      let y = this.origin.y * 100
      let scale = this.scale * 100
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${scale}%`,
        transform: `translate(-${x}%, -${y}%)`,
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
