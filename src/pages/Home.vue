<script>
import marked from 'marked'
import { AppHeader, HeaderIcon } from 'components/AppHeader'
export default {
  components: {
    AppHeader,
    HeaderIcon,
  },
  data: () => ({
    introduce: require('./introduce.md'),
  }),
  methods: {
    marked,
  },
}
</script>

<template>
  <div>
    <app-header title="WEBXOSS">
      <header-icon slot="left" name="menu"/>
      <header-icon slot="right" name="more"/>
    </app-header>
    <article>
      <section v-html="marked(introduce)" :class="$style.markdown"></section>
    </article>
  </div>
</template>

<style module>
@import "css/vars.css";
.markdown {
  padding: 0 1em;
  line-height: 1.5;
  font-size: 1.2em;

  & p,
  & h1,
  & h2,
  & ul {
    margin: 1em 0;
  }

  & h1 {
    font-size: 120%;
    font-weight: bold;
    text-align: center;
  }

  & h2 {
    font-size: 110%;
  }

  & a {
    color: var(--main-color);
  }
}
</style>
