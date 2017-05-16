<script>
import AppHeader from 'components/AppHeader'
import CardImage from 'components/CardImage'
import Localize from 'js/Localize'
import { $get } from 'js/ImageFileCache'

export default {
  components: {
    AppHeader,
    CardImage,
  },
  data: () => ({
    loading: true,
    src: '',
  }),
  computed: {
    pid() {
      // Return <大器晚成>(pid: 23) if invalid
      let pid = +this.$route.query.pid
      return CardInfo[pid] ? pid : 23
    },
    alt() {
      return Localize.cardName(CardInfo[this.pid])
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
  mounted() {
    let url = `./images/raw/${('0000' + this.pid).slice(-4)}.jpg`
    $get(url, 'blob', xhr => {
      this.src = xhr.responseURL
      this.loading = false
    })
  },
}
</script>

<template>
  <div :class="$style.page">
    <app-header title="Gallery"></app-header>
    <div :class="$style.body" @click="goBack">
      <div v-if="loading" :class="$style.wrapper">
        <card-image :class="$style.image" :pid="pid"/>
        <div :class="$style.loader"></div>
      </div>
      <img v-else :class="$style.image" :src="src" :alt="alt"/>
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
.wrapper {
  position: relative;
}
.loader {
  width: 3rem;
  height: 3rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &::before,
  &::after {
    position: absolute;
    content: '';
    top: 0;
    left: 50%;
    width: 3rem;
    margin: 0 0 0 -1.5rem;
    height: 100%;
    border-radius: 500rem;
  }
  &::before {
    border: .3em solid color(#000 a(.1));
    border-color: color(#fff a(.15));
  }
  &::after {
    animation: spin .6s linear;
    animation-iteration-count: infinite;
    border-color: #eee transparent transparent;
    border-style: solid;
    border-width: .3em;
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
