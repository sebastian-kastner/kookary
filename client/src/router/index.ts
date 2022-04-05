import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeEditorView from '../views/RecipeEditorView.vue'
import RecipeView from '../views/RecipeView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import RecipeOverview from '../views/RecipeOverview.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/recipe', name: 'recipe', component: RecipeView },
  { path: '/recipe-editor', name: 'recipe-editor', component: RecipeEditorView },
  { path: '/ingredients', name: 'ingredients', component: IngredientsView },
  { path: '/recipes', name: 'recipes', component: RecipeOverview }
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
