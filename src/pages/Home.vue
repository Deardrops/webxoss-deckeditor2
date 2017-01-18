<template>
  <div class="page">
    <search></search>
    <detail></detail>
    <deck></deck>
  </div>
</template>

<script>

import Detail from 'components/Detail'
import Deck from 'components/Deck'
import Search from 'components/Search'
export default {
  components: {
    Detail,
    Deck,
    Search,
  },
}

</script>
