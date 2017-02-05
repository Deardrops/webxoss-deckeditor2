<script>
let scrollTopMap = {}
export default {
  created() {
    // test
    this.$store.commit('putDeckFile', {
      name: 'WHITE_HOPE',
      pids: require('./WHITE_HOPE.json'),
    })
    this.$store.commit('putDeckFile', {
      name: 'RED_FISH',
      pids: require('./RED_FISH.json'),
    })
    this.$store.commit('putDeckFile', {
      name: 'TEST_DECK',
      pids: require('./TEST_DECK.json'),
    })
    this.$store.commit('switchDeck', 'WHITE_HOPE')
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
