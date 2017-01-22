<script>
import Thumbnail from 'components/Thumbnail'
import Localize from 'js/Localize'

export default {
  components: {
    Thumbnail,
  },
  created() {
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
      <div class="">{{ info.cardType }}</div>
    </div>
  </div>
  <div class="detail-body">
    <table>
      <tbody>
        <tr>
          <td>
            {{ parseEffect }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

</template>

<style scoped>
.detail-head {
	height:20em;
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
  width: 8em; 
  height: 8em; 
  border: 5px solid black; 
  margin: 0.2em;
}
</style>