import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/formMetadates',
    name: 'FormMeta',
    component: () => import( '../views/FormMeta.vue')
  },
  {
    path: '/types',
    name: 'Types',
    component: () => import( '../views/Types.vue')
  },
  {
    path: '/typesGroups',
    name: 'typesGroups',
    component: () => import( '../views/TypesGroups.vue')
  },
  {
    path: '/connections',
    name: 'Connections',
    component: () => import( '../views/Connections.vue')
  },
  {
    path: '/formConnections',
    name: 'FormConnections',
    component: () => import( '../views/FormConnections.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
