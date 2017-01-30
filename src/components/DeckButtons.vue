<script>
import FloatButton from 'components/FloatButton'
import Icon from 'components/Icon'
export default {
  components: {
    FloatButton,
    Icon,
  },
  data: () => ({
    buttons: [
      {
        title: 'Delete',
        icon: 'del',
      },
      {
        title: 'Rename',
        icon: 'edit',
      },
      {
        title: 'Copy',
        icon: 'copy',
      },
      {
        title: 'New Deck',
        icon: 'add',
      },
    ],
  }),
  computed: {
    opened() {
      return !!this.$route.query.menu
    },
  },
  methods: {
    open() {
      this.$router.push({
        path: this.$route.path,
        query: {
          menu: '1',
        },
      })
    },
    close() {
      this.$router.go(-1)
    },
    toggleMenu() {
      this.opened ? this.close() : this.open()
    },
  },
}
</script>

<template>
  <div
    :class="[opened ? $style.opened : '', $style.wrapper]"
    @click.self="close">
    <float-button :class="$style.mainButton"@click.native="toggleMenu()">
      <icon :class="$style.cross" name="add"/>
    </float-button>
    <ul :class="$style.subButtons">
      <li
        v-for="(button, index) in buttons"
        :class="$style.item">
        <label :class="$style.label">{{ button.title }}</label>
        <float-button
          :class="$style.subButton"
          :name="button.icon"/>
      </li>
    </ul>
  </div>
</template>

<style module>
.wrapper.opened {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fffc;
}
.mainButton {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 4rem;
  height: 4rem;
  font-size: 1.5em;
  color: #fff;
  background-color: #ff5722;
  box-shadow: 0 2px 5px #666;
}
.cross {
  transition: transform .5s;
}
.opened {
  & .cross {
    transform: rotate(calc(90deg + 45deg))
  }
}
.subButtons {
  position: fixed;
  bottom: 7rem;
  right: 2rem;
}
.item {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  transition: transform .2s;
  /* set origin to icon center   */
  /* Android 4.3 fallback to 80% */
  transform-origin: 80% bottom;
  transform-origin: calc(100% - 2rem) bottom;
  transform: scale(0, 0);
  @nest .opened & {
    transform: scale(1, 1);
  }
}
.label,
.subButton {
  color: #666;
  background-color: #fff;
  box-shadow: 0 2px 5px #ccc;
}
.label {
  padding: .2rem .4rem;
  border-radius: 3px;
}
.subButton {
  margin: 1rem .5rem;
  width: 3rem;
  height: 3rem;
  font-size: 1.3em;
}
</style>