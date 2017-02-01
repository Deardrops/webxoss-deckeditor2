<!--
  props:
    card: item in CardInfo
-->

<script>
import { mapGetters } from 'vuex'
import Thumbnail from 'components/Thumbnail'
import Counter from 'components/Counter'
import Ball from 'components/Ball'
import Localize from 'js/Localize'

export default {
  components: {
    Thumbnail,
    Counter,
    Ball,
  },
  props: {
    card: {
      type: Object,
      required: true,
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
    name() {
      return Localize.cardName(this.card)
    },
    metas() {
      let card = this.card
      let level = `Lv. ${card.level}`
      let limit = `Limit: ${card.limit}`
      let power = `${card.power}`
      let classes = `<${Localize.classes(card)}>`
      let type = `${Localize.cardType(card)}`

      let levelLimit = `${level}  ${limit}`
      let levelPower = `${level}  ${power}`
      let typeClasses = `${type}  ${classes}`

      return {
        'LRIG': [levelLimit, typeClasses],
        'SIGNI': [levelPower, typeClasses],
        'RESONA': [levelPower, typeClasses],
        'SPELL': [type],
        'ARTS': [type],
      }[card.cardType] || []
    },
    costs() {
      let card = this.card
      let props = [
        'costRed',
        'costBlue',
        'costGreen',
        'costBlack',
        'costWhite',
        'costColorless',
      ]

      // [
      //   {
      //     color: 'red',
      //     count: 3,
      //   },
      // ]
      let costs = props.
      filter(prop => {
        return card[prop] > 0
      })
      .map(prop => {
        return {
          color: prop.replace(/^cost/, '').toLowerCase(),
          count: card[prop],
        }
      })
      .sort((a, b) => {
        // colorless must be last
        if (b.color === 'colorless') {
          return -1
        }
        return b.count - a.count
      })

      return costs
    },
    noCost() {
      let type = this.card.cardType
      if (type === 'SIGNI' || type === 'RESONA') {
        // SIGNI / RESONA do not show " 0 cost"
        return false
      }
      return !this.costs.length
    },
    isRemaining() {
      return this.$store.state.remainingPids.includes(this.card.pid)
    },
  },
  methods: {
    plus() {
      this.$store.commit('addCard', this.card.pid)
    },
    minus() {
      this.$store.commit('delCard', this.card.pid)
    },
  },
}
</script>
<template>
  <router-link :to="detailRoute">
    <div :class="[$style.cell]">
      <thumbnail :class="[$style.thumbnail, $color[card.color]]" :pid="card.pid"></thumbnail>
      <div :class="$style.right">
        <div :class="$style.name">{{ name }}</div>
        <div :class="$style.foot">
          <div>
            <div v-for="meta in metas" :class="$style.meta">{{ meta }}</div>
            <div :class="$style.meta">
              <span v-for="cost in costs" :class="[$style.cost, $color[cost.color]]">
                <ball/><span v-if="cost.count">×{{ cost.count }} </span>
              </span>
              <span v-if="noCost">0费用</span>
            </div>
          </div>
          <counter
            :class="[$style.counter, $style[card.color]]"
            :count="count"
            :isRemaining="isRemaining"
            @plus="plus"
            @minus="minus">
          </counter>
        </div>
      </div>
    </div>
  </router-link>

</template>

<style src="css/colors.css" module="$color"></style>
<style module>
@import 'css/vars.css';

.cell {
  display: flex;
  padding: var(--padding);
  border-bottom: 1px solid #d6d6d6;
}
.thumbnail {
  width: 6.25rem; /* avoid stretch */
  height: 6.25rem;
  border: 2px solid currentColor;
}
.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: calc(var(--padding) / 2) var(--padding);
  overflow: hidden;
}
.name {
  font-size: 1.25em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.foot {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: #929292;
}
.meta {
  font-size: 0.9em;
  line-height: 1.3;
  vertical-align: middle;
}
.cost {
  font-size: 1.1em;
  margin-right: .2em;
  & > span {
    vertical-align: middle;
  }
}

</style>