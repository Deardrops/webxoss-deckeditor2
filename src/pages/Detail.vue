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
    <div class="head">
      <thumbnail class="thumbnail" :pid="pid" @click.native="goGallery"></thumbnail>
      <div class="subtitle">
        <span>{{ card.wxid }}</span>
        <span>{{ card.rarity }}</span>
      </div>
      <div class="title">{{ card.name }}</div>
      <div class="subtitle">
        <span>{{ type }}</span>
        <span>{{ color }}</span>
        <span>{{ limiting }}</span>
      </div>
    </div>
    <div class="table">
      <table>
        <tbody>
          <tr v-for="row in rows">
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

<style scoped>
.head {
  height: 15em;
}
.title {
  font-size: 1.5em;
}
.table {
  width: 100%;
  white-space: pre-line;
}
.thumbnail {
  position: relative;
  float: left;
  width: 11em; 
  height: 11em; 
  border: 5px solid black; 
  margin: 0.2em;
}
</style>
