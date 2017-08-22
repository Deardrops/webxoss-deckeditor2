<script>
import Box from 'components/Box'

export default {
  components: {
    Box,
  },
  props: {
    cards: {
      type: Array,
      require: true,
    },
    loadMoreEnabled: {
      require: false,
    },
  },
  data: () => ({
    colunms: 1,
    rows: 10,
    request: 0,
  }),
  computed: {
    shownCount() {
      return this.colunms * this.rows
    },
    iterator() {
      if (this.loadMoreEnabled) {
        return this.shownCount < this.cards.length
          ? this.cards.slice(0, this.shownCount)
          : this.cards
      } else {
        return this.cards
      }
    },
  },
  methods: {
    loadMore() {
      this.rows += 5
    },
    resetRows() {
      this.rows = 10
    },
    calcColunms() {
      if (this.$children.length) {
        let itemWidth = this.$children[0].$el.clientWidth
        if (itemWidth) {
          let selfWidth = this.$el.clientWidth
          this.colunms = Math.floor(selfWidth / itemWidth)
        }
      }
      this.request = requestIdleCallback(this.calcColunms)
    },
  },
  mounted() {
    this.calcColunms()
    window.onscroll = () => {
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        if (this.shownCount < this.cards.length) {
          this.loadMore()
        }
      }
    }
  },
  destroyed() {
    cancelIdleCallback(this.request)
    window.onscroll = false
  },
}
</script>

<template>
  <div :class="$style.container">
    <box v-for="card in iterator" :card="card" />
  </div>
</template>

<style module>
.container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
