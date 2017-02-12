<script>
let scrollTopMap = {}
export default {
  created() {
    let deckFileNames = localStorage.getItem('deck_filenames')
    let fileNames = JSON.parse(deckFileNames)

    // if no deck in localStorage, initialize WHITE_HOPE
    if (!fileNames || !fileNames.length) {
      this.$store.commit('putDeckFile', {
        name: 'WHITE_HOPE',
        pids: require('./WHITE_HOPE.json'),
      })
      this.$store.commit('switchDeck', 'WHITE_HOPE')
      return
    }

    // initialize deck from localStorage
    fileNames.forEach(name => {
      let deckFile = localStorage.getItem(`deck_file_${name}`)
      if (deckFile) {
        let deck = JSON.parse(deckFile)
        let deckPids = deck.mainDeck.concat(deck.lrigDeck)
        this.$store.commit('putDeckFile', {
          name: name,
          pids: deckPids,
        })
      }
    })
    this.$store.commit('switchDeck', fileNames[0])
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
    <router-view></router-view>
  </div>
</template>

<style src="css/common.css"></style>
