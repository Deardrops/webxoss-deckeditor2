<!--
  props:
    pid, origin, scale

  Should set css width and height for this component.
-->

<script>
import CardImage from 'components/CardImage'
export default {
  components: {
    CardImage,
  },
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
        y: .4,
      }),
    },
    // imageWidth / containerWidth
    scale: {
      type: Number,
      default: 1.35,
    },
  },
  computed: {
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
    <card-image :pid="pid" :style="style"/>
  </div>
</template>

<style module>
.frame {
  position: relative;
  overflow: hidden;
}
</style>
