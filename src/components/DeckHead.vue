<script>
import { mapGetters } from 'vuex'
import Localize from 'js/Localize'
import checkMayusRoom from 'js/MayusRoom'
export default {
  props: {
    lrig: {
      require: false,
    },
  },
  computed: {
    ...mapGetters([
      'deck',
      'mainDeck',
      'lrigDeck',
    ]),
    burstCount() {
      return this.deck
        .map(card => CardInfo[card.cid]) // TODO: utils
        .filter(card => card.burstEffectTexts)
        .length
    },
    burstClass() {
      return this.burstCount === 20 ? '' : this.$style.warn
    },
    mainCount() {
      return this.mainDeck.length
    },
    mainClass() {
      return this.mainCount === 40 ? '' : this.$style.warn
    },
    lrigCount() {
      return this.lrigDeck.length
    },
    lrigClass() {
      return this.lrigCount <= 10 ? '' : this.$style.warn
    },
    deckBanned() {
      return checkMayusRoom(this.deck)
    },
  },
  methods: {
    L(text) {
      return Localize(text)
    },
  },
}
</script>
<template>
  <div :class="$style.subheader">
    <template v-if="!lrig">
      <span :class="$style.name">{{ L('main_deck') }}</span>
      <span :class="mainClass">{{ mainCount }}</span>/40

      <span :class="$style.right">
        <span v-show="!lrig && deckBanned" :class="[$style.mayu, $style.warn]">
            {{ L('mayu_room') }}
        </span>

        <span>
          {{ L('life_burst_short') }}:
        </span>
        <span :class="burstClass">{{ burstCount }}</span>/20
      </span>
    </template>

    <template v-if="lrig">
      <span :class="$style.name">{{ L('lrig_deck') }}</span>
      <span :class="lrigClass">{{ lrigCount }}</span>/10
    </template>

  </div>
</template>
<style module>
.subheader {
  display: flex;
  color: #666;
}
.name {
  padding-right: .5em;
}
.mayu {
  padding-right: 1em;
}
.right {
  margin-left: auto;
}
.warn {
  color: #ff5722;
}
</style>
