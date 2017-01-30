import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: require('pages/Home'),
    },
    {
      path: '/deck',
      component: require('pages/Deck'),
    },
    {
      path: '/search',
      component: require('pages/Search'),
    },
    {
      path: '/detail',
      component: require('pages/Detail'),
    },
    {
      path: '/gallery',
      component: require('pages/Gallery'),
    },
  ],
})
