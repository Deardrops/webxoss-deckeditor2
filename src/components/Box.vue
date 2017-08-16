<script>
import Thumbnail from 'components/Thumbnail'
import Icon from 'components/Icon'
import Localize from 'js/Localize'

export default {
  props: {
    card: {
      type: Object,
      require: true,
    },
    selection: {
      require: true,
    },
  },
  components: {
    Thumbnail,
    Icon,
  },
  data: () => ({
    selected: false,
  }),
  computed:{
    name() {
      return Localize.cardName(this.card)
    },
    pid() {
      return this.card.pid
    },
  },
  methods: {
    click() {
      if (this.selected) {
        this.selected = false
        // this.$store.commit('clearShownPid')
        this.$store.commit('delSelectedPid', this.pid)
      } else {
        this.selected = true
        this.$store.commit('addSelectedPid', this.pid)
      }
    },
    actionClick() {
      this.$store.commit('setShownPid', this.pid)
    },
  },
  watch: {
    selection(selection) {
      if (selection === false) {
        this.selected = false
      }
    },
  },
}

</script>

<template>
  <div :class="$style.wrapper">
    <div
      :class="$style.box"
      @click.stop="click">
      <thumbnail :class="$style.image" :pid="card.pid" />
      <div v-show="selected" :class="$style.relative">
        <div :class="$style.dimmer">
          <icon :class="$style.circle" name="check" />
        </div>
      </div>
      <div :class="$style.content">
        <div :class="$style.title" :title="name">{{ name }}</div>
        <a :class="$style.action" @click.stop="actionClick">
          <icon name="information" />
        </a>
      </div>
    </div>
  </div>
</template>

<style module>
@import 'css/vars.css';
.wrapper {
  height: 10.1rem;
  width: 8rem;
  padding: .5rem;
}
.box {
  height: 100%;
  width: 100%;
  cursor: pointer;
  @apply --shadow-2dp;
  transition: .3s;
}
.box:hover {
  @apply --shadow-6dp;
}
.image {
  width: 8rem;
  height: 8rem;
}
.dimmer {
  position: relative;
  top: -8rem;
  left: 0;
  height: 8rem;
  width: 8rem;
  background-color: color(#000 a(.65))
}
.relative {
  position: relative;
  height: 0;
}
.circle {
  position: absolute;
  top: .5em;
  right: .5em;
  z-index: var(--z-box-counter);
  font-size: 1.5em;
  padding: .2em;
  background-color: color(#fff a(.9));
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
}
.content {
  display: flex;
  height: 2.1em;
  background-color: #333;
}
.title {
  flex: 1;
  font-size: .7rem;
  padding: 1em 0 1em 1em;
  overflow: hidden;
  width: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
}
.action {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.1rem;
  height: 2.1rem;
  color: #fff;
}
</style>
