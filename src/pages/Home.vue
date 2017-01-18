<template>
  <div class="page">
    <search></search>
    <detail></detail>
    <deck></deck>
  </div>
</template>

<script>

import Detail from 'pages/Detail'
import Deck from 'pages/Deck'
import Search from 'pages/Search'
export default {
  components: {
    Detail,
    Deck,
    Search,
  },
}

</script>
