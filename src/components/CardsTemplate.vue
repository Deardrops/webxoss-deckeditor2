<script>
import Thumbnail from 'components/Thumbnail'
export default {
  components: {
    Thumbnail,
  },
  props: ['deck'],
  methods: {
    add(pid) {
      this.$store.commit('addCard', pid)
    },
    del(pid) {
      this.$store.commit('delCard', pid)
    },
    parseInfo(card) {
      // TODO: design showing info
      // TODO: code style optimize
      let map = {
        'RESONA': [{
          preText: 'Lv.',
          text: card.info.level,
        }, {
          preText: 'Power:',
          text: card.info.power,
        }],
        'SIGNI': [{
          preText: 'Lv.',
          text: card.info.level,
        }, {
          preText: 'Power:',
          text: card.info.power,
        }],
        'SPELL': [{
          preText: 'Color:',
          text: card.info.color,
        }],
        'LRIG': [{
          preText: 'Lv.',
          text: card.info.level,
        }, {
          preText: 'Limit:',
          text: card.info.limit,
        }],
        'ARTS': [{
          preText: 'Color:',
          text: card.info.color,
        }],
      }
      return map[card.info.cardType]
    },
  },
}
</script>
<template>
  <div>
    <div v-for="card in deck" class="card-item">
      <thumbnail class="thumbnail" :pid="card.pid"></thumbnail>
      <div class="card-item-info">
        <div class="card-item-title">{{ card.info.name }}</div>
        <div class="card-item-subtitle">
          <div class="card-item-info">
          <span>{{ card.info.cardType }}</span>
          <span
            v-for="info in parseInfo(card)">
            {{ info.preText }}
            {{ info.text }}
          </span>
          </div>
          <div class="card-item-count">
            <button @click="del(card.pid)">-</button>
            <span>{{ card.count }}</span>
            <button @click="add(card.pid)">+</button>
          </div>
        </div>
      </div>
    </div>
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
.card-item-count button {
  background-color: #ffffff;
  border: none;
  color: #555555;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.2em;
  width: 1.2em;
}
.card-item-subtitle {
  display: flex;
}
</style>