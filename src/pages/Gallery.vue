<script>
import ImageManager from 'js/ImageManager.js'
import AppHeader from 'components/AppHeader'

export default {
  components: {
    AppHeader,
  },
  computed: {
    pid() {
      // Return <大器晚成>(pid23) if invalid
      let pid = +this.$route.query.pid
      return CardInfo[pid] ? pid : 23
    },
    src() {
      return ImageManager.getUrlByPid(this.pid)
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}

</script>

<template>
  <div :class="$style.page">
    <app-header title="Gallery"></app-header>
    <div :class="$style.body" @click="goBack">
      <img :class="$style.image" :src="src">
    </div>
  </div>
</template>

<style module>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #333;
}
.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.image {
  width: 100%;
}
</style>
