<script>
import Localize from 'js/Localize'
export default {
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  computed: {
    name() {
      return Localize.cardName(this.card)
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
    hasEffect() {
      return this.cardEffect !== '-'
    },
    hasLifeBurst() {
      return this.lifeBurst !== '-'
    },
    rows() {
      let card = this.card
      let type = {
        key: Localize('cardType'),
        value: Localize(card.cardType),
      }
      let color = {
        key: Localize('color'),
        value: Localize(card.color),
      }
      let level = {
        key: Localize('level'),
        value: card.level,
      }
      let power = {
        key: Localize('power'),
        value: card.power,
      }
      let limit = {
        key: Localize('limit'),
        value: (card.limit < 1024) ? card.limit : '∞',
      }
      let cost = {
        key: Localize('cost'),
        value: Localize.cost(card),
      }
      let timing = {
        key: Localize('timings'),
        value: Localize.timings(card),
      }
      let classes = {
        key: Localize('classes'),
        value: Localize.classes(card),
      }
      let guard = {
        key: Localize('guard'),
        value: Localize.guard(card),
      }
      return {
        'RESONA': [
          [type, color],
          [level, classes],
          [power, guard],
        ],
        'SIGNI': [
          [type, color],
          [level, classes],
          [power, guard],
        ],
        'SPELL': [
          [type, color],
          [cost],
        ],
        'LRIG': [
          [type, color],
          [level, classes],
          [limit, cost],
        ],
        'ARTS': [
          [type, color],
          [cost],
          [timing],
        ],
      }[card.cardType] || []
    },
  },
}
</script>

<template>
  <table :class="$style.table">
    <tbody>
      <tr v-for="row in rows" :class="$style.rows">
        <template v-for="meta in row">
          <td :class="$style.key">{{ meta.key }}</td>
          <td :colspan="row.length === 1 ? 3 : 1">{{ meta.value }}</td>
        </template>
      </tr>
      <tr v-if="hasEffect">
        <td colspan="4">{{ cardEffect }}</td>
      </tr>
      <tr v-if="hasLifeBurst">
        <td colspan="4">{{ lifeBurst }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style module scoped>
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
  width: 20%;
  text-align: center;
}
</style>
