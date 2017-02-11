<script>
import Icon from 'components/Icon'
export default {
  components: {
    Icon,
  },
  props: ['name', 'label'],
}
</script>

<template>
  <span role="button">
    <icon :name="name" :label="label"></icon>
  </span>
</template>

<style module scoped>
@import 'css/vars.css';
span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--header-height);
  height: var(--header-height);
  line-height: var(--header-height);
  font-size: 1.8rem;
}
</style>
