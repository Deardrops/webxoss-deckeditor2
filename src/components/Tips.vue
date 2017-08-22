<script>
import marked from 'marked'

export default {
  props: {
    name: {
      type: String,
      require: true,
    },
  },
  data: () => ({
    tips: {
      searchTips: require('../pages/searchTips.md'),
      emptyTips: require('../pages/emptyTips.md'),
    },
  }),
  computed: {
    html() {
      return this.tips[this.name] ? marked(this.tips[this.name]) : ''
    },
  },
}
</script>

<template>
  <section :class="$style.tips">
    <div v-html="html" />
  </section>
</template>

<style module>
.tips {
  padding: 2rem 2rem 0 2rem;
  color: #666;
  line-height: 1.5;

  & h3 {
    font-size: 1.5em;
  }

  & p,
  & ul {
    margin: .5em 0; 
  }

  & ul {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 2em;
  }

  & code {
    margin: 0 .2em;
    font-family: monospace;
    white-space: nowrap;
    border-bottom: 1px dotted #333;
  }
}
</style>
