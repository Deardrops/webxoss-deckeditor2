<script>
let scrollTopMap = {}
export default {
  created() {
    // init Deck from localStorage
    let deck_filenames = localStorage.getItem('deck_filenames')
    if (deck_filenames) {
      let FileNames = JSON.parse(deck_filenames)
      FileNames.forEach(name => {
        let deckFile = localStorage.getItem('deck_file_'+name)
        if (deckFile) {
          let deck = JSON.parse(deckFile)
          let deckPids = deck.mainDeck.concat(deck.lrigDeck)
          this.$store.commit('putDeckFile', {
            name: name,
            pids: deckPids,
          })
        }
      })
      this.$store.commit('switchDeck', FileNames[0])
    } else {
      this.$store.commit('putDeckFile', {
        name: 'WHITE_HOPE',
        pids: require('./WHITE_HOPE.json'),
      })
      this.$store.commit('switchDeck', 'WHITE_HOPE')
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === from.path) {
        return
      }
      scrollTopMap[from.path] = window.scrollY
      this.$nextTick(() => {
        window.scrollTo(0, scrollTopMap[to.path])
      })
    },
  },
}
</script>

<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<style src="css/common.css"></style>
