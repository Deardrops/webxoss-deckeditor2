<script>
import { mapGetters } from 'vuex'
import Thumbnail from 'components/Thumbnail'

export default {
  components: {
    Thumbnail,
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
    <Thumbnail 
      :class="[$style.thumbnail, $color[card.color]]"
      :origin="{ x: .5, y: .37 }"
      :scale="1.06"
      :pid="card.pid"/>
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
.thumbnail {
  width: 100%;
}
.thumbnail::before {
  /* 长宽固定の黑科技 */
  content: "";
  display: inline-block;
  padding-bottom: 100%;
  vertical-align: middle;
}
.dimmer {
  position: absolute;
  right: .2em;
  bottom: .2em;
  padding: 0 .2em;
  color: #fff;
  background-color: color(#000 a(.7));
}
</style>