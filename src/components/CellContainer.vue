<script>
import { mapState } from 'vuex'
import Cell from 'components/Cell'

// 8rem
let cellHeight = 8

export default {
  components: {
    Cell,
  },
  props: {
    cards: {
      type: Array,
      required: true,
    },
    protectionEnabled: {
      require: false,
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
  }),
  computed: {
    ...mapState([
      'windowWidth',
    ]),
    isTwoColunm() {
      return this.windowWidth >= 1024
    },
    allColunmsCount() {
      return this.isTwoColunm
        ? Math.ceil(this.cards.length / 2)
        : this.cards.length
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
      return this.isTwoColunm
        ? this.cards.slice(2 * this.start, 2 * this.end)
        : this.cards.slice(this.start, this.end)
    },
    shownColunmsCount() {
      return this.isTwoColunm
        ? Math.ceil(this.shownCards.length / 2)
        : this.shownCards.length
    },
    padding() {
      // Paddings before / after shown cells.
      // They keep list height and scroll position from changing。
      let beforeCount = this.start
      let afterCount = this.allColunmsCount - this.shownColunmsCount - beforeCount
      return {
        'padding-top': `${cellHeight * beforeCount}rem`,
        'padding-bottom': `${cellHeight * afterCount}rem`,
      }
    },
    cardIterator() {
      return this.longListOpimizationEnabled
        ? this.shownCards
        : this.cards
    },
  },
  methods: {
    updateIndex() {
      // Find the top cell in viewport according to `window.scrollY`.
      let fontSize = +window.getComputedStyle(window.document.body)
        .fontSize.slice(0, -2)
      this.index = Math.round(window.scrollY / (cellHeight * fontSize))
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
    <div v-for="card in cardIterator" :class="$style.col">
      <cell :card="card" :protectionEnabled="protectionEnabled"/>
    </div>
  </div>
</template>

<style module>
.row {
  display: flex;
  flex-wrap: wrap;
}
.col {
  width: 100%;
  @media (width >= 1024px) {
    width: 50%;
  }
}
</style>
