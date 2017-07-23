<script>
import Thumbnail from 'components/Thumbnail'
import Localize from 'js/Localize'
import Icon from 'components/Icon'

export default {
  props: {
    card: {
      type: Object,
      require: true,
    },
    actionType: {
      type: String,
      require: true,
    },
  },
  components: {
    Thumbnail,
    Icon,
  },
  data: () => ({
    actionVisible: false,
  }),
  computed:{
    name() {
      return Localize.cardName(this.card)
    },
  },
  methods: {
    click() {
      this.$emit('click', this.card.pid)
    },
    buttonClick() {
      this.$emit('action', this.card.pid)
    },
    showAction() {
      this.actionVisible = true
    },
    hideAction() {
      this.actionVisible = false
    },
  },
}

</script>

<template>
  <div
    :class="$style.wrapper"
    @click.stop="click"
    @mouseover="showAction"
    @mouseout="hideAction">
    <thumbnail :class="$style.image" :pid="card.pid" />
    <div :class="$style.dimmer">
      <div :class="$style.title">{{ name }}</div>
      <a v-show="actionVisible" :class="$style.action" @click.stop="buttonClick">
        <icon v-if="actionType==='add'" name="add" />
        <icon v-else name="add" style="transform: rotate(45deg);"/>
      </a>
    </div>
  </div>
</template>

<style module>
@import 'css/vars.css';
.wrapper {
  width: 8rem;
  height: 8rem;
  margin: .5rem;
  @apply --shadow-2dp;
}
.wrapper:hover {
  @apply --shadow-6dp;
}
.image {
  width: 100%;
  height: 100%;
}
.dimmer {
  position: relative;
  top: -2.2rem;
  display: flex;
  background-color: color(#000 a(.65))
}
.title {
  flex: 1;
  font-size: .8rem;
  line-height: 1rem;
  padding: .1rem .2rem;
  height: 2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}
.action {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  padding: .1rem .2rem;
  font-size: 2rem;
  color: #fff;
}
</style>
