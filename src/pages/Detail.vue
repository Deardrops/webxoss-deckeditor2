<script>
import Thumbnail from 'components/Thumbnail'
import Localize from 'js/Localize'

export default {
  components: {
    Thumbnail,
  },
  created() {
    this.query = 649 // test use
    /*
    LRIG: 649
    ARTS: 1908
    SINGI: 1801
    RESONA: 1895

    */
    Localize.setLanguage('zh_CN') // test use
  },
  computed: {
    query: {
      get() {
        return Number(this.$route.query.query)
      },
      set(value) {
        // TODO: check if Number && <= total card count
        if (value) {
          this.$router.replace({
            path: '/detail',
            query: {
              query: value,
            },
          })
        } else {
          this.$route.replace('/detail')
        }
      },
    },
    info() {
      return CardInfo[this.query]
    },
    parseEffect() {
      return Localize.effectTexts(this.info)
    },
    parseBurst() {
      return Localize.burstEffectTexts(this.info)
    },
    metas() {
      let card = this.info
      let level = {
        key: 'Lv.',
        value: card.level,
      }
      let power = {
        key: 'Power',
        value: card.power,
      }
      let limit = {
        key: 'Limit',
        value: (card.limit < 1024) ? card.limit : '∞',
      }
      let cost = {
        key: 'cost',
        value: Localize.cost(card),
      }
      let timming = {
        key: 'timming',
        value: Localize.timmings(card),
      }
      let classes = {
        key: 'class',
        value: Localize.classes(card),
      }
      let guard = {
        key: 'guard',
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
          [limit, cost]
        ],
        'ARTS': [
          [cost],
          [timming],
        ],
      }[card.cardType] || []
    },
  },
}

</script>

<template>
  <div id="Detail">
  <div class="detail-head">
    <thumbnail class="thumbnail" :pid="query"></thumbnail>
    <div class="pre-title">
      <span class="wxid">{{ info.wxid }}</span>
      <span class="rarity">{{ info.rarity }}</span>
    </div>
    <div class="title">{{ info.name }}</div>
    <div class="sub-title">
      <span class="">{{ info.cardType }}</span>
      <span class="">{{ info.color }}</span>
    </div>
  </div>
  <div class="detail-body">
    <table>
      <tbody>
        <tr v-for="row in metas">
        	<template v-for="meta in row">
            <td>{{ meta.key }}</td>
            <td>{{ meta.value }}</td>
          </template>
        </tr>
        <tr>
          <td colspan="4">
            {{ parseEffect }}
          </td>
        </tr>
        <tr>
          <td colspan="4">
            {{ parseBurst }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

</template>

<style scoped>
.detail-head {
	height: 15em;
}
.pre-title,
.sub-title {

}
.detail-body {
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