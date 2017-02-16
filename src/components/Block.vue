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
  },
  computed: {
    ...mapGetters([
      'deckPids',
    ]),
    detailRoute() {
      return {
        path: '/detail',
        query: {
          pid: this.card.pid,
        },
      }
    },
    count() {
      return this.deckPids.filter(pid => pid === this.card.pid).length
    },
  },
}
</script>

<template>
  <router-link :to="detailRoute" :class="$style.block">
    <card-image :pid="card.pid" :class="$style.image"/>
    <div :class="$style.dimmer">×{{ count }}</div>
  </router-link>
</template>

<style src="css/colors.css" module="$color"></style>
<style module>
.block {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  padding: .2em;
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
  color: #fff;
  background-color: color(#000 a(.6));
}
</style>
