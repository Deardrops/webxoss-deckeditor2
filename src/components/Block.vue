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
  <router-link :to="detailRoute">
    <Thumbnail 
      :class="[$style.thumbnail, $color[card.color]]"
      :origin="{ x: .5, y: .37 }"
      :scale="1.06"
      :pid="card.pid"/>
    <div :class="$style.wrapper">
      <div :class="$style.dimmer">
        <!-- <span>{{ card.cardType }}</span> -->
        <span :class="$style.count">×{{ count }}</span>
      </div>
    </div>
  </router-link>
</template>

<style src="css/colors.css" module="$color"></style>
<style module>
.thumbnail {
  width: 100%;
  border: 2px solid currentColor;
  margin: auto 0;
}
.thumbnail:before {
  content: ""; /* 长宽固定の黑科技 */
  display: inline-block;
  padding-bottom: 100%;
  vertical-align: middle;
}
.wrapper {
  position: relative;
  height: 0;
}
.dimmer {
  position: absolute;
  top: -1.2em;
  left: 2px; /* thumbnail's border */
  width: 100%;
  height: 1.2em;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
}
.count {
  float: right;
  padding-right: 0.2em;
}
</style>