<script>
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
    isTwoColunm() {
      return window.screen.width > 768
    },
    allColunmsCount() {
      if (this.isTwoColunm) {
        return Math.ceil(this.cards.length / 2)
      } else {
        return this.cards.length
      }
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
      if (this.isTwoColunm) {
        return this.cards.slice(2 * this.start, 2 * this.end)
      } else {
        return this.cards.slice(this.start, this.end)
      }
    },
    shownColunmsCount() {
      if (this.isTwoColunm) {
        return Math.ceil(this.shownCards.length / 2)
      } else {
        return this.cards.length
      }
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
    this.updateIndex()
  },
  destroyed() {
    cancelIdleCallback(this.request)
  },
}
</script>

<template>
  <div :class="$style.row" :style="padding">
    <div v-for="card in shownCards" :class="$style.col">
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
  @media (width > 768px) {
    width: 50%;
  }
}
</style>
