<script>
import { AppHeader, HeaderIcon } from 'components/AppHeader'
export default {
  components: {
    AppHeader,
    HeaderIcon,
  },
}
</script>

<template>
  <div>
    <app-header title="WEBXOSS">
      <header-icon slot="left" name="menu"/>
      <header-icon slot="right" name="more"/>
    </app-header>
    <router-link to="/deck">Deck Editor</router-link>
  </div>
</template>
