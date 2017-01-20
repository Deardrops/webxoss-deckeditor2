<script>
import Thumbnail from 'components/Thumbnail'
import Counter from 'components/Counter'

function getUniqueCards(cardIds) {
  // unique card with its count
  // return Map(): key = pid | value = count
  let uniqueCards = new Map()
  cardIds.forEach(pid => {
    if (uniqueCards.has(pid)) {
      uniqueCards.set(pid, uniqueCards.get(pid)+1)
      return
    }
    uniqueCards.set(pid, 1)
  })
  return uniqueCards
}

export default {
  components: {
    Thumbnail,
    Counter,
  },
  props: ['cardIds'],
  computed: {
    cards() {
      // return card list: [{ info , count },...]
      let cards = []
      let cardsMap = getUniqueCards(this.cardIds)
      cardsMap.forEach((count, pid) => {
        cards.push({
          info: CardInfo[pid],
          count: count,
        })
      })
      return cards
    },
  },
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
          text: card.level,
        }, {
          preText: 'Power:',
          text: card.power,
        }],
        'SIGNI': [{
          preText: 'Lv.',
          text: card.level,
        }, {
          preText: 'Power:',
          text: card.power,
        }],
        'SPELL': [{
          preText: 'Color:',
          text: card.color,
        }],
        'LRIG': [{
          preText: 'Lv.',
          text: card.level,
        }, {
          preText: 'Limit:',
          text: card.limit,
        }],
        'ARTS': [{
          preText: 'Color:',
          text: card.color,
        }],
      }
      return map[card.cardType]
    },
  },
}
</script>
<template>
  <div>
    <div v-for="card in cards" class="card-item">
      <thumbnail class="thumbnail" :pid="card.info.pid"></thumbnail>
      <div class="card-item-info">
        <div class="card-item-title">{{ card.info.name }}</div>
        <div class="card-item-subtitle">
          <div class="card-item-info">
          <span>{{ card.info.cardType }}</span>
          <span
            v-for="info in parseInfo(card.info)">
            {{ info.preText }}
            {{ info.text }}
          </span>
          </div>
          <counter
            :count="card.count"
            @plus="add(card.info.pid)"
            @minus="del(card.info.pid)">
          </counter>
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
/*.card-item-count button {
  background-color: #ffffff;
  border: none;
  color: #555555;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.2em;
  width: 1.2em;
}*/
.card-item-subtitle {
  display: flex;
}
</style>