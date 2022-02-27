import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeEditorView from '../views/RecipeEditorView.vue'
import IngredientsView from '../views/IngredientsView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/add-recipe', name: 'Rezept hinzufügen', component: RecipeEditorView },
  { path: '/ingredients', name: 'Zutaten', component: IngredientsView }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
