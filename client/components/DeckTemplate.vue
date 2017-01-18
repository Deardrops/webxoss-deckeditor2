<script>
export default {
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
          preText: '共鸣精灵',
          text: '',
        }],
        'SIGNI': [{
          preText: 'Lv.',
          text: card.info.level,
        }, {
          preText: 'Power:',
          text: card.info.power,
        }],
        'SPELL':[{
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
      <div class="card-item-img">
        <img :src="card.img" class="card-img"/>
      </div>
      <div class="card-item-info">
        <div class="card-item-title">{{ card.info.name }}</div>
        <div class="card-item-subtitle">
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
</template>

<style scoped>
.card-item {
  overflow: auto;
}
.card-item-img {
  position: relative;
  float: left;
  width: 100px; 
  height: 100px; 
  border: 5px solid black; 
  overflow: hidden;
  margin: 0.2em;
}
.card-img {
  width:150%;
  margin-left:-25%;
  margin-top:-25%;
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
</style>