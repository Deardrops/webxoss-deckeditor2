<script>
let state = {
  // ['', 'updating', 'ready']
  status: '',
  total: 0,
  loaded: 0,
}
let cache = window.applicationCache
if (cache) {
  cache.addEventListener('downloading', () => {
    state.status = 'updating'
  }, false)
  cache.addEventListener('updateready', () => {
    state.status = 'ready'
  }, false)
  cache.addEventListener('cached', () => {
    state.status = 'ready'
  }, false)
  cache.addEventListener('progress', () => {
    state.total = event.total
    state.loaded = event.loaded
  }, false)
}

export default {
  data: () => state,
  computed: {
    percent() {
      if (!this.total) {
        return ''
      }
      return `${Math.round(this.loaded / this.total * 100)}%`
    },
    text() {
      return {
        updating: `Updating... ${this.percent}`,
        ready: 'A new version is ready',
      }[this.status] || ''
    },
  },
  methods: {
    reload() {
      location.reload()
    },
  },
}
</script>

<template>
  <div :class="$style.bar" v-if="status">
    <span :class="$style.text">{{ text }}</span>
    <button
      :class="$style.button"
      @click="reload"
      v-if="status === 'ready'">
      SWITCH
    </button>
  </div>
</template>

<style module>
.bar {
  position: relative;
  color: #fff;
  background-color: #333;
  padding: 0 2em;
  height: 3.5em;

  display: flex;
  align-items: center;
  justify-content: space-between;
}
.button {
  color: #4caf50;
  font-weight: bold;
}
</style>
