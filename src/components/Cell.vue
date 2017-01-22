<!--
  props:
    card, count
  events:
    plus, minus
-->

<script>
import Thumbnail from 'components/Thumbnail'
import Counter from 'components/Counter'

export default {
  components: {
    Thumbnail,
    Counter,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  computed: {
    metas() {
      let card = this.card
      let level = {
        key: 'Lv.',
        value: card.level,
      }
      let power = {
        key: 'Power:',
        value: card.power,
      }
      let color = {
        key: 'Color:',
        value: card.color,
      }
      let limit = {
        key: 'Limit',
        value: card.limit,
      }

      return {
        'RESONA': [level],
        'SIGNI': [level, power],
        'SPELL': [color],
        'LRIG': [level, limit],
        'ARTS': [color],
      }[card.cardType] || []
    },
  },
  methods: {
    detailPage() {
      return {
        path: '/detail',
        query: {
          pid: this.card.pid,
        },
      }
    },
    add() {
      this.$store.commit('addCard', this.card.pid)
    },
    del() {
      this.$store.commit('delCard', this.card.pid)
    },
  },
}
</script>
<template>
  <div class="card-item">
    <router-link :to="detailPage()">
      <thumbnail class="thumbnail" :pid="card.pid"></thumbnail>
      <div class="card-item-info">
        <div class="card-item-title">{{ card.name }}</div>
        <div class="card-item-subtitle">
          <div class="card-item-info">
            <!-- <span>{{ card.cardType }}</span> -->
            <template v-for="meta in metas">
              <span>{{ meta.key }}</span>
              <span>{{ meta.value }}</span>
            </template>
          </div>
          <counter
            :count="count"
            @plus="add"
            @minus="del">
          </counter>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.card-item {
  overflow: auto;
}
.thumbnail {
  position: relative;
  float: left;
  width: 4em; 
  height: 4em; 
  border: 5px solid black; 
  margin: 0.2em;
}
</style>