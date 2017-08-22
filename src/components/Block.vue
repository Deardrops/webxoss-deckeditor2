<script>
import { mapGetters } from 'vuex'
import CardImage from 'components/CardImage'

export default {
  components: {
    CardImage,
  },
  props: {
    card: {
      type: Object,
      require: true,
    },
    showCount: {
      type: Boolean,
      require: false,
    },
  },
  computed: {
    ...mapGetters([
      'deckPids',
    ]),
    count() {
      return this.deckPids.filter(pid => pid === this.card.pid).length
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.card.pid)
    },
  },
}
</script>

<template>
  <a :class="$style.block" @click.stop="handleClick">
    <card-image :pid="card.pid" :class="$style.image" />
    <div v-if="showCount" :class="$style.dimmer">×{{ count }}</div>
  </a>
</template>

<style module>
.block {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
}
.image {
  width: 100%;
  vertical-align: bottom;
}
.dimmer {
  position: absolute;
  right: .2em;
  bottom: .2em;
  padding: 0 .2em;
  font-size: 1.2em;
  color: #fff;
  background-color: color(#000 a(.6));
}
</style>
