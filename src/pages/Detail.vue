<script>
import AppHeader from 'components/AppHeader'
import Thumbnail from 'components/Thumbnail'
import Localize from 'js/Localize'

export default {
  components: {
    AppHeader,
    Thumbnail,
  },
  computed: {
    pid: {
      get() {
        return +this.$route.query.pid
      },
      set(value) {
        // TODO: check if int && <= total card count
        if (!value) {
          this.$route.replace('/detail')
        }
        this.$router.replace({
          path: '/detail',
          query: {
            pid: +value,
          },
        })
      },
    },
    card() {
      // TODO: avoid return undefined
      return CardInfo[this.pid]
    },
    name() {
      return Localize.cardName(this.card)
    },
    type() {
      return Localize.cardType(this.card)
    },
    color() {
      return Localize.color(this.card.color)
    },
    limiting() {
      return Localize.limiting(this.card)
    },
    cardEffect() {
      return Localize.effectTexts(this.card)
    },
    lifeBurst() {
      return Localize.burstEffectTexts(this.card)
    },
    rows() {
      let card = this.card
      let level = {
        key: Localize.propToKey('level'),
        value: card.level,
      }
      let power = {
        key: Localize.propToKey('power'),
        value: card.power,
      }
      let limit = {
        key: Localize.propToKey('limit'),
        value: (card.limit < 1024) ? card.limit : '∞',
      }
      let cost = {
        key: Localize.propToKey('cost'),
        value: Localize.cost(card),
      }
      let timming = {
        key: Localize.propToKey('timmings'),
        value: Localize.timmings(card),
      }
      let classes = {
        key: Localize.propToKey('classes'),
        value: Localize.classes(card),
      }
      let guard = {
        key: Localize.propToKey('guard'),
        value: Localize.guard(card),
      }
      return {
        'RESONA': [
          [level, classes],
          [power, guard],
        ],
        'SIGNI': [
          [level, classes],
          [power, guard],
        ],
        'SPELL': [
          [cost],
        ],
        'LRIG': [
          [level, classes],
          [limit, cost],
        ],
        'ARTS': [
          [cost],
          [timming],
        ],
      }[card.cardType] || []
    },
  },
  methods: {
    goGallery() {
      this.$router.push({
        path: '/gallery',
        query: {
          pid: this.pid,
        },
      })
    },
  },
}

</script>

<template>
  <div>
    <app-header title="Detail"></app-header>
    <div :class="$style.head">
      <thumbnail :class="$style.thumbnail" :pid="pid" @click.native="goGallery"></thumbnail>
      <div :class="$style.right">
        <div>
          <div>
            <span>{{ card.wxid }}</span>
            <span :class="$style.align">{{ card.rarity }}</span>
          </div>
          <div :class="$style.title">{{ name }}</div>
        </div>
        <div>
          <span>{{ type }}</span>
          <span>{{ color }}</span>
          <span :class="$style.align">{{ limiting }}</span>
        </div>
      </div>
    </div>
    <div :class="$style.table">
      <table>
        <tbody>
          <tr v-for="row in rows" :class="$style.rows">
          	<template v-for="meta in row">
              <td>{{ meta.key }}</td>
              <td>{{ meta.value }}</td>
            </template>
          </tr>
          <tr>
            <td colspan="4">
              {{ cardEffect }}
            </td>
          </tr>
          <tr>
            <td colspan="4">
              {{ lifeBurst }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style module>
@import 'css/vars.css';
.head {
  display: flex;
  /*padding: var(--padding);*/
}
.title {
  font-size: 1.5em;
}
.table {
  width: 100%;
  white-space: pre-line;
}
.rows>td:nth-child(odd) {
  text-align: center;
  color: #fff;
  background-color: var(--main-color);
}
.thumbnail {
  width: 11em; 
  height: 11em; 
  border: 5px solid black;
  margin: .5em;
}
.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: calc(var(--padding) / 2) var(--padding);
  overflow: hidden;
  padding: .5em 0;
}
.align {
  float: right;
}
</style>
