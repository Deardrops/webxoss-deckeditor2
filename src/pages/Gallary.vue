<script>
import ImageManager from 'js/ImageManager.js'
import AppHeader from 'components/AppHeader'

export default {
  components: {
    AppHeader,
  },
  computed: {
    pid() {
      return +this.$route.query.pid
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
    <app-header title="Gallary"></app-header>
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
