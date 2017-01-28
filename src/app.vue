<script>
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
    this.$store.commit('switchDeck', 'WHITE_HOPE')
  },
}
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style src="css/common.css"></style>
