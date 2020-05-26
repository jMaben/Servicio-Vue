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
    path: '/connectionsData',
    name: 'ConnectionsData',
    component: () => import( '../views/ConnectionsData.vue')
  },
  {
    path: '/connections',
    name: 'Connections',
    component: () => import( '../views/Connections.vue'),
  },
  {
    path: '/editConnections/:idvalor',
    name: 'editConnections',
    component: () => import( '../views/editConnections.vue'),
    props: true,
  },
  {
    path: '/ConverMeta/:idOrigen/:idDestino/:nameOrigen/:nameDestino',
    name: 'ConverMeta',
    component: () => import( '../views/ConverMeta.vue'),
    props: true,
  },
  {
    path: '/MetaTransform/:idOrigen/:idDestino/:nameOrigen/:nameDestino',
    name: 'MetaTransform',
    component: () => import( '../views/MetaTransform.vue'),
    props: true,
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
