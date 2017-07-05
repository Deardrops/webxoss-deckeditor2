<script>
import { mapState } from 'vuex'

export default {
  props: {
    cards: {
      type: Array,
      required: true,
    },
    longListOpimizationEnabled: {
      require: false,
    },
    columnNumber: {
      require: false,
    },
  },
  data: () => ({
    request: -1,

    /*
      Long list optimization.

      Only render card cells in viewport.
      Cells outside viewport are replaced with list padding.

      `index`:
        The index of the top cell in viewport.
        It's automatically set when scrolling.
        See `updateIndex` for details.
    */
    index: 0,
    itemHeight: 1,
  }),
  computed: {
    ...mapState([
      'windowWidth',
    ]),
    _colNum() {
      return this.columnNumber ? this.columnNumber : 1
    },
    allColunmsCount() {
      return Math.ceil(this.cards.length / this._colNum)
    },
    start() {
      // 5 colunms before index
      return Math.max(0, this.index - 5)
    },
    end() {
      // 10 colunms after index
      return Math.min(this.allColunmsCount, this.index + 10)
    },
    shownCards() {
      return this.cards.slice(this._colNum * this.start, this._colNum * this.end)
    },
    shownColunmsCount() {
      return Math.ceil(this.shownCards.length / this._colNum)
    },
    padding() {
      // Paddings before / after shown cells.
      // They keep list height and scroll position from changing。
      let beforeCount = this.start
      let afterCount = this.allColunmsCount - this.shownColunmsCount - beforeCount
      return {
        'padding-top': `${this.itemHeight * beforeCount}px`,
        'padding-bottom': `${this.itemHeight * afterCount}px`,
      }
    },
    iterator() {
      return this.longListOpimizationEnabled
        ? this.shownCards
        : this.cards
    },
  },
  methods: {
    updateIndex() {
      // Find the top cell in viewport according to`window.scrollY`.
      if (this.$children.length) {
        this.itemHeight = this.$children[0].$el.getBoundingClientRect().height
      }
      let scrollPostion = document.body.clientHeight === window.innerHeight ?
        this.$el.parentElement.scrollTop :
        window.scrollY
      this.index = Math.round(scrollPostion / this.itemHeight)

      this.request = requestIdleCallback(this.updateIndex)
    },
  },
  mounted() {
    if (this.longListOpimizationEnabled) {
      this.updateIndex()
    }
  },
  destroyed() {
    cancelIdleCallback(this.request)
  },
}
</script>

<template>
  <div :class="$style.row" :style="padding">
    <slot v-for="item in iterator" :card="item"/>
  </div>
</template>

<style module>
.row {
  display: flex;
  flex-wrap: wrap;
}
.row>* {
  width: 100%;
}
</style>
