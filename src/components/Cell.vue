<!--
  props:
    card: item in CardInfo
-->

<script>
import { mapState, mapGetters } from 'vuex'
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
    protectionEnabled: {
      require: false,
    },
  },
  computed: {
    ...mapState([
      'remainingPids',
    ]),
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

      // let levelLimit = `${level}  ${limit}`
      // let levelPower = `${level}  ${power}`
      // let typeClasses = `${type}  ${classes}`

      return {
        'LRIG': [[level, limit], [type, classes]],
        'SIGNI': [[level, power], [type, classes]],
        'RESONA': [[level, power], [type, classes]],
        'SPELL': [[type]],
        'ARTS': [[type]],
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
    noCostText() {
      return `0 ${Localize.propToKey('cost')}`
    },
    isRemaining() {
      return this.protectionEnabled && this.remainingPids.includes(this.card.pid)
    },
  },
  methods: {
    plus() {
      let pid = this.card.pid

      // card count === 0 && click [+] button
      if (this.protectionEnabled && !this.deckPids.includes(pid)) {
        // remove this card from state.remainingPids
        this.$store.commit('delRemainingCard', pid)
      }

      this.$store.commit('addCard', pid)
    },
    minus() {
      let pid = this.card.pid

      // 2-step removing for preventing from operation mistakes
      if (this.protectionEnabled) {
        if (this.count === 1) {
          // 1st step: keep this pid in remainingPids
          this.$store.commit('addRemainingCard', pid)
        } else if (this.count === 0) {
          // 2nd step: remove it from remainingPids
          this.$store.commit('delRemainingCard', pid)
        }
      }

      this.$store.commit('delCard', pid)
    },
  },
}
</script>
<template>
  <router-link :to="detailRoute">
    <div :class="[$style.cell, isRemaining ? $style.translucent : '']">
      <thumbnail :class="[$style.thumbnail, $color[card.color]]" :pid="card.pid"></thumbnail>
      <div :class="$style.right">
        <div :class="$style.name">{{ name }}</div>
        <div :class="$style.foot">
          <div>
            <div v-for="rows in metas" :class="$style.meta">
              <span v-for="meta in rows">{{ meta }}</span>
            </div>
            <div :class="$style.meta">
              <span v-for="cost in costs" :class="[$style.cost, $color[cost.color]]">
                <ball/><span v-if="cost.count">×{{ cost.count }} </span>
              </span>
              <span v-if="noCost">{{ noCostText }}</span>
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

.translucent {
  opacity: 0.7;
}
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
  & > span {
    display: inline-block;
    margin-right: .3em;
    vertical-align: middle;
  }
}
.cost {
  font-size: 1.1em;
  margin-right: .2em;
}

</style>