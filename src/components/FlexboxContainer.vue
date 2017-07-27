<script>

export default {
  props: {
    cards: {
      type: Array,
      require: true,
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
      return this.shownCount < this.cards.length
        ? this.cards.slice(0, this.shownCount)
        : this.cards
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
        let selfWidth = this.$el.clientWidth
        this.colunms = Math.floor(selfWidth / itemWidth)
      }
      this.request = requestIdleCallback(this.calcColunms)
    }
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
  },
}
</script>

<template>
  <div :class="$style.container">
    <slot v-for="item in iterator" :card="item"/>
  </div>
</template>

<style module>
.container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
