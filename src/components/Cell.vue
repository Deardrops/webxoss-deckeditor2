<!--
  props:
    card: item in CardInfo
-->

<script>
import { mapState, mapGetters } from 'vuex'
import Thumbnail from 'components/Thumbnail'
import Counter from 'components/Counter'
import Ball from 'components/Ball'
import Icon from 'components/Icon'
import Localize from 'js/Localize'

export default {
  components: {
    Thumbnail,
    Counter,
    Ball,
    Icon,
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
      let level = `Lv.${card.level}`
      let limit = `${Localize('limit')}:${card.limit}`
      let power = `${card.power}`
      let classes = `<${Localize.classes(card)}>`
      let type = `${Localize(card.cardType)}`

      let levelLimit = `${level} | ${limit}`
      let levelPower = `${level} | ${power}`

      return {
        'LRIG': [type, levelLimit],
        'SIGNI': [type, levelPower, classes],
        'RESONA': [type, levelPower, classes],
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
    hasBurst() {
      let card = CardInfo[this.card.cid]
      return !!card.burstEffectTexts
    },
    noCostText() {
      return Localize('no_cost')
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

      this.$store.dispatch('addCard', pid).then((successed) => {
        if (!successed) {
          console.log('already full') // show toast here
        }
      })
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
      <div>
        <thumbnail :class="[$style.thumbnail, $color[card.color]]" :pid="card.pid"></thumbnail>
        <div v-if="hasBurst" :class="$style.wrapper">
          <div :class="[$style.hexagon, $color[card.color]]">
            <icon name="hexagon" aria-hidden="true"/>
            <icon :class="$style.burst" name="burst" label="burst"/>
          </div>
        </div>
      </div>
      <div :class="$style.right">
        <div :class="$style.name">{{ name }}</div>
        <div :class="$style.foot">
          <div>
            <div v-for="meta in metas" :class="$style.meta">{{ meta }}</div>
            <div :class="$style.meta">
              <span v-for="cost in costs" :class="[$style.cost, $color[cost.color]]">
                <ball/><span v-if="cost.count">×{{ cost.count }} </span>
              </span>
              <span v-if="noCost">{{ noCostText }}</span>
            </div>
          </div>
          <counter
            :class="$style.counter"
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
.wrapper {
  position: relative;
  height: 0;
}
.burst {
  transform: scale(0.8);
  color: #fff;
}
.hexagon {
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 1em;
  height: 1em;
  font-size: 1.5em;
  & > svg {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.cell {
  display: flex;
  padding: var(--padding);
  border-bottom: 1px solid var(--cell-border-color);
}
.thumbnail {
  width: 6.25rem; /* avoid stretch */
  height: 6.25rem;
  border: 2px solid currentColor;
  margin: auto 0;
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
  line-height: 1.3em;
}
.cost {
  font-size: 1.1em;
  margin-right: .2em;
  & > span {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
