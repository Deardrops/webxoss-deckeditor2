<script>
import Icon from 'components/Icon'
export default {
  components: {
    Icon,
  },
  props: ['name'],
}
</script>

<template>
  <div>
    <icon :name="name"></icon>
  </div>
</template>

<style module scoped>
@import 'css/vars.css';
div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--header-height);
  height: var(--header-height);
  line-height: var(--header-height);
  font-size: 1.8rem;
}
</style>
