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
    itemHeight: 8,
  }),
  computed: {
    ...mapState([
      'windowWidth',
      'fontSize',
    ]),
    colunms() {
      // window's width > 1024px, use 2 colunm view
      return this.windowWidth > 1024 ? 2 : 1
    },
    rows() {
      return this.cards.length / this.colunms
    },
    start() {
      // 5 colunms before index
      return Math.max(0, this.index - 5)
    },
    end() {
      // 10 colunms after index
      return Math.min(this.rows, this.index + 10)
    },
    shownCards() {
      return this.cards.slice(this.colunms * this.start, this.colunms * this.end)
    },
    shownRows() {
      return Math.ceil(this.shownCards.length / this.colunms)
    },
    padding() {
      // Paddings upper / under shown cells.
      // They keep list height and scroll position from changing。
      let upperCount = this.start
      let underCount = this.rows - this.shownRows - upperCount
      return {
        'padding-top': `${this.itemHeight * upperCount}rem`,
        'padding-bottom': `${this.itemHeight * underCount}rem`,
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
      // Find the top item in viewport according to`window.scrollY`.
      this.index = Math.round(window.scrollY / this.itemHeight / this.fontSize)
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
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.row>a {
  width: 100%;
  @media (width >= 1024px) {
    width: 50%;
  }
}
</style>
