<script>
export default {
  props: ['deck'],
  methods: {
    add:function(Info) {
      let deckName
      if (Info.cardType === 'SIGNI' || Info.cardType === 'SPELL') {
        deckName = 'mainDeck'
      } else {
        deckName = 'lrigDeck'
      }
      this.$store.commit('AddCard', {
        deckName: deckName,
        pid: Info.pid,
      })
    },
    del:function(Info) {
      let deckName
      if (Info.cardType === 'SIGNI' || Info.cardType === 'SPELL') {
        deckName = 'mainDeck'
      } else {
        deckName = 'lrigDeck'
      }
      this.$store.commit('DelCard', {
        deckName: deckName,
        pid: Info.pid,
      })
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
        <div class="card-item-title">{{card.info.name}}</div>
        <div 
          v-if="card.info.cardType === 'SIGNI'"
          class="card-item-subtitle">
          <span>Lv.{{card.info.level}}</span>
          <span>Power:{{card.info.power}}<span>
        </div>
        <div 
          v-if="card.info.cardType === 'SPELL'"
          class="card-item-subtitle">
          <span>{{card.info.color}}</span>
          <!-- <span>{{card.info.limiting}}<span> -->
        </div>
        <div 
          v-if="card.info.cardType === 'LRIG'"
          class="card-item-subtitle">
          <span>Lv.{{card.info.level}}</span>
          <span>Limit:{{card.info.limit}}<span>
        </div>
        <div 
          v-if="card.info.cardType === 'ARTS'"
          class="card-item-subtitle">
          <span>{{card.info.color}}</span>
          <!-- <span>{{card.info.limiting}}<span> -->
        </div>
        <div class="card-item-count">
          <button v-on:click="del(card.info)">-</button>
          <span>{{card.count}}</span>
          <button v-on:click="add(card.info)">+</button>
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
  margin: 0.5em;
}
.card-img {
  width:150%;
  margin-left:-25%;
  margin-top:-25%;
}
.card-item-count button{
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