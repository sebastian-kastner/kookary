import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeEditorView from '../views/RecipeEditorView.vue'
import RecipeView from '../views/RecipeView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import RecipeOverview from '../views/RecipeOverview.vue'
import Account from '../views/user/Account.vue'

import { userStore } from '../stores/rootStore';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/recipe', name: 'recipe', component: RecipeView },
  { path: '/recipe-editor', name: 'recipe-editor', component: RecipeEditorView },
  { path: '/ingredients', name: 'ingredients', component: IngredientsView },
  { path: '/recipes', name: 'recipes', component: RecipeOverview },
  { path: '/user/account', name: 'account', component: Account },

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path && to.path.startsWith("/user")) {
    if (!userStore.user) {
      next("/");
      return;
    }
  }
  next();
});

export default router
