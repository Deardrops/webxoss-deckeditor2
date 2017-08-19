<script>
import { mapState } from 'vuex'
import CardImage from 'components/CardImage'
import CardInfoTable from 'components/CardInfoTable'
import Localize from 'js/Localize'

export default {
  components: {
    CardImage,
    CardInfoTable,
  },
  data: () => ({
    pid: 1,
  }),
  computed: {
    ...mapState([
      'shownPid',
    ]),
    card() {
      return CardInfo[this.pid]
    },
    name() {
      return Localize.cardName(this.card)
    },
    limiting() {
      return Localize.limiting(this.card)
    },
  },
  watch: {
    shownPid(pid) {
      if (0 < pid && pid < Object.keys(CardInfo).length) {
        this.pid = pid
      }
    },
  },
}
</script>

<template>
  <div :class="$style.cardInfo">
    <card-image :class="$style.image" :pid="pid"/>
    <div style="display: flex;">
      <span>{{ card.wxid }}</span>
      <span style="margin-left: auto;">{{ limiting }}</span>
    </div>
    <div style="font-size: 1.5em;">{{ name }}</div>
    <card-info-table :card="card" />
  </div>
</template>

<style module>
@import 'css/vars.css';
.cardInfo {
  font-size: .85rem;
}
.image {
  width: 100%;
  display: block;
  margin: 0 auto;
}
</style>

