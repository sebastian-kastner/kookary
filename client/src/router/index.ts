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
  { path: '/recipes', name: 'recipes', component: RecipeOverview },
]

const router = new VueRouter({
  routes
})

export default router
