<script>
import AppHeader from 'components/AppHeader'
import CardImage from 'components/CardImage'

export default {
  components: {
    AppHeader,
    CardImage,
  },
  computed: {
    pid() {
      // Return <大器晚成>(pid: 23) if invalid
      let pid = +this.$route.query.pid
      return CardInfo[pid] ? pid : 23
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
      <card-image :class="$style.image" :pid="pid">
    </div>
  </div>
</template>

<style module>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #333;
  justify-content: center;
}
.body {
  display: table-cell;
  overflow-y: auto;
}
.image {
  width: 100%;
}
</style>
