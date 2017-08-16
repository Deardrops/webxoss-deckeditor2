<script>
import { mapState } from 'vuex'
import Localize from 'js/Localize'
import CardImage from 'components/CardImage'
import CardInfoTable from 'components/CardInfoTable'

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
    sidebarVisible() {
      return !!this.shownPid
    },
    card() {
      return CardInfo[this.pid]
    },
    cardName() {
      return Localize.cardName(this.card)
    },
    cardLimiting() {
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
  <transition name="slide">
    <div v-show="sidebarVisible" :class="$style.sidebar">
      <card-image :class="$style.image" :pid="pid"/>
      <div style="display: flex;">
        <span>{{ card.wxid }}</span>
        <span style="margin-left: auto;">{{ cardLimiting }}</span>
      </div>
      <div style="font-size: 1.5em;">{{ cardName }}</div>
      <card-info-table :card="card"/>
    </div>
  </transition>
</template>

<style module>
@import 'css/vars.css';
.sidebar {
  position: fixed;
  z-index: var(--z-sidebar);
  top: 4rem;
  right: 0;
  width: 20%;
  height: calc(100% - var(--header-height));
  background-color: #fafafa;
  overflow-y: auto;
  box-shadow: -2px 0 4px 0 rgba(0, 0, 0, .15);
  padding: .5em;
}
.image {
  width: 80%;
  display: block;
  margin: 0 auto;
}
.sidebar:global(.slide-enter-active) {
  animation: slide-in .5s;
}
.sidebar:global(.slide-leave-active) {
  animation: slide-in .5s reverse;
}
@keyframes slide-in {
  from {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

</style>
