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
  <button>
    <icon :name="name" :label="label"></icon>
  </button>
</template>

<style module scoped>
@import 'css/vars.css';
button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--header-height);
  height: var(--header-height);
  line-height: var(--header-height);
  font-size: 1.8rem;
}
</style>
