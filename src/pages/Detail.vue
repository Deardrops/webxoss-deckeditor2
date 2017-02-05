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
        // Return <大器晚成>(pid23) if invalid
        let pid = +this.$route.query.pid
        return CardInfo[pid] ? pid : 23
      },
      set(value) {
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
    <div :class="$style.body">
      <div :class="$style.header">
        <thumbnail :class="[$style.thumbnail, $color[card.color]]" :pid="pid" @click.native="goGallery"></thumbnail>
        <div :class="$style.main">
          <div>
            <div>
              <span>{{ card.wxid }}</span>
              <span :class="$style.right">{{ card.rarity }}</span>
            </div>
            <div :class="$style.title">{{ name }}</div>
          </div>
          <div>
            <span>{{ type }}</span>
            <span :class="$style.right">{{ limiting }}</span>
          </div>
        </div>
      </div>
      <table :class="$style.table">
        <tbody>
          <tr v-for="row in rows" :class="$style.rows">
          	<template v-for="meta in row">
              <td :class="$style.key">{{ meta.key }}</td>
              <td :colspan="row.length === 1 ? 3 : 1">{{ meta.value }}</td>
            </template>
          </tr>
          <tr>
            <td colspan="4">{{ cardEffect }}</td>
          </tr>
          <tr>
            <td colspan="4">{{ lifeBurst }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style src="css/colors.css" module="$color"></style>
<style module scoped>
@import 'css/vars.css';
.body {
  margin: 0.5em;
}
.header {
  display: flex;
  margin-bottom: 0.5em;
}
.title {
  font-size: 1.5em;
}
.table {
  width: 100%;
  line-height: 1.5;
  white-space: pre-line;
  table-layout: fixed;
  border-collapse: collapse;
}
td {
  border: 1px solid #cbcbcb;
  padding: .5em .2em;
}
.key {
  width: 15%;
  text-align: center;
}
.thumbnail {
  width: 11em; 
  height: 11em; 
  border: 3px solid currentColor;
}
.main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  overflow: hidden;
  padding: .5em;
}
.right {
  float: right;
}
</style>
