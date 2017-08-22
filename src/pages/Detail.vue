<script>
import AppHeader from 'components/AppHeader'
import Thumbnail from 'components/Thumbnail'
import CardInfoTable from 'components/CardInfoTable'
import Localize from 'js/Localize'

export default {
  components: {
    AppHeader,
    Thumbnail,
    CardInfoTable,
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
    limiting() {
      return Localize.limiting(this.card)
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
            <div style="display: flex;">
              <span>{{ card.wxid }}</span>
              <span style="margin-left: auto;">{{ card.rarity }}</span>
            </div>
            <div style="font-size: 1.5em;">{{ name }}</div>
          </div>
          <div style="display: flex;">
            <span style="margin-left: auto;">{{ limiting }}</span>
          </div>
        </div>
      </div>
      <card-info-table :card="card"/>
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
</style>
